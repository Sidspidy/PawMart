import { Router } from 'express';
import { sendOtp, verifyOtp, refreshToken, getMe, updateMe } from '../../controllers/auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many OTP requests. Try again in 10 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);

export default router;
