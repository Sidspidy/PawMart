import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, buildPagination } from '../utils/apiResponse';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/AppError';
import { createOrderSchema } from '../utils/validators';
import { Order, OrderStatus } from '../models/Order.model';
import { Cart } from '../models/Cart.model';
import { Product } from '../models/Product.model';
import { UserRole } from '../models/User.model';
import * as PointsService from '../services/points.service';
import { PointsTransactionType } from '../models/Points.model';
import * as EmailService from '../services/email.service';

// POST /api/orders
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const data = createOrderSchema.parse(req.body);
  const userId = req.user!._id.toString();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let discount = 0;
    let pointsDeducted = 0;

    // Deduct redeemed points
    if (data.pointsToRedeem > 0) {
      const rupeeValue = PointsService.pointsToRupees(data.pointsToRedeem);
      await PointsService.debitPoints(userId, data.pointsToRedeem, PointsTransactionType.REDEEMED_ORDER, 'Points redeemed on order', undefined, session);
      discount += rupeeValue;
      pointsDeducted = data.pointsToRedeem;
    }

    // Deduct stock
    for (const item of data.items) {
      const updated = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { new: true, session }
      );
      if (!updated || updated.stock < 0) {
        throw new BadRequestError(`Insufficient stock for product ${item.product}`);
      }
    }

    const subtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const total = Math.max(0, subtotal - discount);
    const pointsEarned = PointsService.calculateEarnedPoints(total);

    const [order] = await Order.create(
      [
        {
          user: userId,
          items: data.items.map((i) => ({
            ...i,
            productName: '',
            productImage: '',
            totalPrice: i.price * i.quantity,
          })),
          shippingAddress: data.shippingAddress,
          paymentMethod: data.paymentMethod,
          couponCode: data.couponCode,
          pointsUsed: pointsDeducted,
          pointsEarned,
          subtotal,
          discount,
          total,
          statusHistory: [{ status: OrderStatus.PENDING }],
        },
      ],
      { session }
    );

    // Clear cart
    await Cart.findOneAndUpdate({ user: userId }, { items: [], subtotal: 0 }, { session });

    await session.commitTransaction();

    // Fire-and-forget emails / point credits
    EmailService.sendOrderConfirmationEmail(req.user!.email, order.orderNumber, order.total).catch(console.error);

    sendCreated(res, order, 'Order placed successfully');
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

// GET /api/orders  (customer sees own; admin sees all)
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 10);
  const skip = (page - 1) * limit;

  const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER].includes(req.user!.role);
  const filter: Record<string, unknown> = isAdmin ? {} : { user: req.user!._id };
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'name email'),
    Order.countDocuments(filter),
  ]);

  sendSuccess(res, orders, 'Orders fetched', 200, buildPagination(page, limit, total));
});

// GET /api/orders/:id
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');
  if (!order) throw new NotFoundError('Order not found');

  const isOwner = order.user._id.toString() === req.user!._id.toString();
  const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.STAFF].includes(req.user!.role);
  if (!isOwner && !isAdmin) throw new ForbiddenError();

  sendSuccess(res, order, 'Order fetched');
});

// PATCH /api/orders/:id/status  [Admin]
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id).populate('user', 'email name');
  if (!order) throw new NotFoundError('Order not found');

  order.status = status;
  order.statusHistory.push({ status, note, timestamp: new Date(), updatedBy: req.user!._id as any });
  if (status === OrderStatus.DELIVERED) {
    order.deliveredAt = new Date();
    // Credit points post-delivery
    PointsService.rewardOrderPoints(order.user._id.toString(), order._id as any, order.total).catch(console.error);
  }
  await order.save();

  const user = order.user as any;
  EmailService.sendOrderStatusEmail(user.email, order.orderNumber, status).catch(console.error);

  sendSuccess(res, order, 'Order status updated');
});
