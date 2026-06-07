import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, buildPagination } from '../utils/apiResponse';
import { NotFoundError } from '../utils/AppError';
import { createPaymentOrder, PaymentGateway, verifyRazorpaySignature } from '../services/payment.service';
import { Order, PaymentStatus } from '../models/Order.model';
import { BadRequestError } from '../utils/AppError';
import * as PointsService from '../services/points.service';

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
    customerId: order.user.toString(),
    customerPhone: order.shippingAddress.phone,
  });

  order.paymentOrderId = result.orderId;
  await order.save();

  sendSuccess(res, result, 'Payment order created');
});

// POST /api/payment/verify
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, gateway, razorpayOrderId, razorpayPaymentId, razorpaySignature, stripePaymentIntentId, cashfreeOrderId } = req.body;
  if (!orderId) throw new BadRequestError('orderId is required');

  const order = await Order.findById(orderId);
  if (!order) throw new NotFoundError('Order not found');

  let isVerified = false;
  let paymentId = '';

  if (gateway === 'razorpay') {
    isVerified = await verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    paymentId = razorpayPaymentId;
  } else if (gateway === 'stripe') {
    const Stripe = (await import('stripe' as string)).default;
    const { env } = await import('../config/env');
    const stripe = new (Stripe as any)(env.STRIPE_SECRET_KEY);
    const intent = await stripe.paymentIntents.retrieve(stripePaymentIntentId || order.paymentOrderId);
    isVerified = intent.status === 'succeeded';
    paymentId = intent.id;
  } else if (gateway === 'cashfree') {
    const { env } = await import('../config/env');
    const isSandbox = !env.NODE_ENV || env.NODE_ENV !== 'production';
    const url = isSandbox
      ? `https://sandbox.cashfree.com/pg/orders/${cashfreeOrderId || order.paymentOrderId}`
      : `https://api.cashfree.com/pg/orders/${cashfreeOrderId || order.paymentOrderId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-client-id': env.CASHFREE_APP_ID ?? '',
        'x-client-secret': env.CASHFREE_SECRET_KEY ?? '',
        'x-api-version': '2023-08-01',
      },
    });
    const cfOrder = (await response.json()) as any;
    isVerified = cfOrder.order_status === 'PAID';
    paymentId = cfOrder.order_id;
  } else {
    throw new BadRequestError('Invalid payment gateway');
  }

  if (!isVerified) {
    throw new BadRequestError('Payment verification failed');
  }

  order.paymentStatus = PaymentStatus.PAID;
  order.paymentId = paymentId;
  await order.save();

  // Award reward points for the order
  await PointsService.rewardOrderPoints(order.user.toString(), order._id as any, order.total);

  sendSuccess(res, { orderNumber: order.orderNumber }, 'Payment verified');
});

// POST /api/payment/webhook/razorpay
export const razorpayWebhook = asyncHandler(async (req: Request, res: Response) => {
  // TODO: verify webhook signature from req.headers['x-razorpay-signature']
  const event = req.body;
  if (event.event === 'payment.captured') {
    const paymentId = event.payload?.payment?.entity?.id;
    const orderReceipt = event.payload?.payment?.entity?.order_id;
    const order = await Order.findOneAndUpdate(
      { paymentOrderId: orderReceipt },
      { paymentStatus: PaymentStatus.PAID, paymentId },
      { new: true }
    );
    if (order) {
      await PointsService.rewardOrderPoints(order.user.toString(), order._id as any, order.total);
    }
  }
  res.status(200).json({ received: true });
});
