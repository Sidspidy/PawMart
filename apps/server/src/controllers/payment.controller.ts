import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, buildPagination } from '../utils/apiResponse';
import { NotFoundError } from '../utils/AppError';
import { createPaymentOrder, PaymentGateway, verifyRazorpaySignature } from '../services/payment.service';
import { Order, PaymentStatus } from '../models/Order.model';
import { BadRequestError } from '../utils/AppError';

// POST /api/payment/initiate
export const initiatePayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, gateway } = req.body;
  if (!orderId || !gateway) throw new BadRequestError('orderId and gateway required');

  const order = await Order.findById(orderId);
  if (!order) throw new NotFoundError('Order not found');
  if (order.user.toString() !== req.user!._id.toString()) throw new BadRequestError('Unauthorized');

  const result = await createPaymentOrder({
    gateway: gateway as PaymentGateway,
    amount: order.total,
    receipt: order.orderNumber,
  });

  order.paymentOrderId = result.orderId;
  await order.save();

  sendSuccess(res, result, 'Payment order created');
});

// POST /api/payment/verify
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const isValid = await verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!isValid) throw new BadRequestError('Payment verification failed');

  const order = await Order.findById(orderId);
  if (!order) throw new NotFoundError('Order not found');

  order.paymentStatus = PaymentStatus.PAID;
  order.paymentId = razorpayPaymentId;
  await order.save();

  sendSuccess(res, { orderNumber: order.orderNumber }, 'Payment verified');
});

// POST /api/payment/webhook/razorpay
export const razorpayWebhook = asyncHandler(async (req: Request, res: Response) => {
  // TODO: verify webhook signature from req.headers['x-razorpay-signature']
  const event = req.body;
  if (event.event === 'payment.captured') {
    const paymentId = event.payload?.payment?.entity?.id;
    const orderReceipt = event.payload?.payment?.entity?.order_id;
    await Order.findOneAndUpdate(
      { paymentOrderId: orderReceipt },
      { paymentStatus: PaymentStatus.PAID, paymentId }
    );
  }
  res.status(200).json({ received: true });
});
