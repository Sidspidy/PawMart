import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, buildPagination } from '../../utils/apiResponse';
import { NotFoundError } from '../../utils/AppError';
import { Order, OrderStatus } from '../../models/Order.model';
import * as PointsService from '../../services/points.service';
import * as EmailService from '../../services/email.service';

// GET /api/admin/orders
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 15);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (req.query.status && req.query.status !== 'All') filter.status = req.query.status;

  if (req.query.q) {
    // Search by orderNumber or customer query
    filter.$or = [
      { orderNumber: { $regex: req.query.q as string, $options: 'i' } }
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'name email'),
    Order.countDocuments(filter),
  ]);

  sendSuccess(res, orders, 'All orders fetched for admin', 200, buildPagination(page, limit, total));
});

// GET /api/admin/orders/:id
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('coupon', 'code type value');
  if (!order) throw new NotFoundError('Order not found');
  sendSuccess(res, order, 'Order fetched successfully');
});

// PATCH /api/admin/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id).populate('user', 'email name');
  if (!order) throw new NotFoundError('Order not found');

  order.status = status;
  order.statusHistory.push({ status, note, timestamp: new Date(), updatedBy: req.user!._id as any });
  
  if (status === OrderStatus.DELIVERED) {
    order.deliveredAt = new Date();
    PointsService.rewardOrderPoints(order.user._id.toString(), order._id as any, order.total).catch(console.error);
  }
  
  await order.save();

  const user = order.user as any;
  EmailService.sendOrderStatusEmail(user.email, order.orderNumber, status).catch(console.error);

  sendSuccess(res, order, 'Order status updated');
});
