import { Router } from 'express';
import { initiatePayment, verifyPayment, razorpayWebhook } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/initiate', authenticate, initiatePayment);
router.post('/verify', authenticate, verifyPayment);
// Webhooks — no auth (verified via signature)
router.post('/webhook/razorpay', razorpayWebhook);

export default router;
