import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendCreated, buildPagination } from '../../utils/apiResponse';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../utils/AppError';
import { createOrderSchema } from '../../utils/validators';
import { Order, OrderStatus } from '../../models/Order.model';
import { Cart } from '../../models/Cart.model';
import { Product } from '../../models/Product.model';
import { Coupon, CouponType, CouponScope } from '../../models/Coupon.model';
import * as PointsService from '../../services/points.service';
import { PointsTransactionType } from '../../models/Points.model';
import * as EmailService from '../../services/email.service';

// POST /api/orders
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const data = createOrderSchema.parse(req.body);
  const userId = req.user!._id.toString();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let discount = 0;
    let pointsDeducted = 0;

    if (data.pointsToRedeem > 0) {
      const rupeeValue = PointsService.pointsToRupees(data.pointsToRedeem);
      await PointsService.debitPoints(userId, data.pointsToRedeem, PointsTransactionType.REDEEMED_ORDER, 'Points redeemed on order', undefined, session);
      discount += rupeeValue;
      pointsDeducted = data.pointsToRedeem;
    }

    const orderItems = [];
    for (const item of data.items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new NotFoundError(`Product not found: ${item.product}`);
      }

      let updated;
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find((v) => v.sku === item.sku);
        if (!variant) {
          throw new BadRequestError(`Variant SKU ${item.sku} not found for product ${product.name}`);
        }
        if (variant.stock < item.quantity) {
          throw new BadRequestError(`Insufficient stock for variant "${variant.label}" of ${product.name}`);
        }
        updated = await Product.findOneAndUpdate(
          { _id: item.product, 'variants.sku': item.sku },
          {
            $inc: {
              'variants.$.stock': -item.quantity,
              stock: -item.quantity,
            },
          },
          { new: true, session }
        );
      } else {
        if (product.stock < item.quantity) {
          throw new BadRequestError(`Insufficient stock for product ${product.name}`);
        }
        updated = await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        );
      }

      if (!updated) {
        throw new BadRequestError(`Failed to update stock for product ${item.product}`);
      }

      orderItems.push({
        product: item.product,
        variant: item.variant,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        productName: updated.name,
        productImage: updated.images && updated.images.length > 0
          ? (typeof updated.images[0] === 'string' ? updated.images[0] : (updated.images[0]?.url || '/images/hero/dog.png'))
          : '/images/hero/dog.png',
        totalPrice: item.price * item.quantity,
      });
    }

    const subtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
    
    let couponDiscount = 0;
    let shippingFee = subtotal >= 999 ? 0 : 49;

    if (data.couponCode) {
      const coupon = await Coupon.findOne({
        code: data.couponCode.toUpperCase(),
        isActive: true,
        startsAt: { $lte: new Date() },
        expiresAt: { $gte: new Date() },
      }).session(session);

      if (!coupon) {
        throw new BadRequestError('Invalid or expired coupon code');
      }

      if (coupon.scope === CouponScope.USER && !coupon.applicableUsers.some(u => u.toString() === userId)) {
        throw new BadRequestError('This coupon is not valid for your account');
      }

      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        throw new BadRequestError('Coupon usage limit reached');
      }

      if (subtotal < coupon.minOrderValue) {
        throw new BadRequestError(`Minimum order value ₹${coupon.minOrderValue} required for this coupon`);
      }

      if (coupon.type === CouponType.PERCENTAGE) {
        couponDiscount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount) {
          couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
        }
      } else if (coupon.type === CouponType.FLAT) {
        couponDiscount = Math.min(coupon.value, subtotal);
      } else if (coupon.type === CouponType.FREE_SHIPPING) {
        shippingFee = 0;
      }

      coupon.usedCount += 1;
      await coupon.save({ session });
    }

    const totalDiscount = discount + couponDiscount;
    const appliedDiscount = Math.min(totalDiscount, subtotal);
    const total = Math.max(0, subtotal - appliedDiscount + shippingFee);
    const pointsEarned = PointsService.calculateEarnedPoints(total);

    const [order] = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          shippingAddress: data.shippingAddress,
          paymentMethod: data.paymentMethod,
          couponCode: data.couponCode,
          pointsUsed: pointsDeducted,
          pointsEarned,
          subtotal,
          shippingFee,
          discount: appliedDiscount,
          total,
          statusHistory: [{ status: OrderStatus.PENDING }],
        },
      ],
      { session }
    );

    await Cart.findOneAndUpdate({ user: userId }, { items: [], subtotal: 0 }, { session });

    await session.commitTransaction();

    if (data.paymentMethod === 'cod') {
      await PointsService.rewardOrderPoints(userId, order._id as any, order.total);
    }

    EmailService.sendOrderConfirmationEmail(req.user!.email, order.orderNumber, order.total).catch(console.error);

    sendCreated(res, order, 'Order placed successfully');
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

// GET /api/orders
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 10);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { user: req.user!._id };
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  sendSuccess(res, orders, 'Orders fetched', 200, buildPagination(page, limit, total));
});

// GET /api/orders/:id
export const getMyOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new NotFoundError('Order not found');

  const isOwner = order.user.toString() === req.user!._id.toString();
  if (!isOwner) throw new ForbiddenError();

  sendSuccess(res, order, 'Order fetched');
});
