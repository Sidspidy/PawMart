import { Router } from 'express';
import {
  sendOtp,
  verifyOtp,
  refreshToken,
  getMe,
  updateMe,
  loginCustomer,
  sendRegisterOtp,
  verifyRegisterAndCreate,
  sendForgotPasswordOtp,
  verifyForgotPasswordAndReset,
} from '../../controllers/auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5,
  message: { success: false, message: 'Too many OTP requests. Try again in 10 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin OTP routes (still mapped to secure staff console)
router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', verifyOtp);

// Customer Auth routes
router.post('/login', loginCustomer);
router.post('/register/send-otp', otpLimiter, sendRegisterOtp);
router.post('/register/verify', verifyRegisterAndCreate);
router.post('/forgot-password/send-otp', otpLimiter, sendForgotPasswordOtp);
router.post('/forgot-password/verify', verifyForgotPasswordAndReset);

// Universal Session routes
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);

export default router;
