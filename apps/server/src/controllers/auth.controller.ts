import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { BadRequestError, TooManyRequestsError } from '../utils/AppError';
import { sendOtpSchema, verifyOtpSchema, updateProfileSchema } from '../utils/validators';
import * as OtpService from '../services/otp.service';
import * as AuthService from '../services/auth.service';
import * as EmailService from '../services/email.service';
import { User } from '../models/User.model';

// POST /api/auth/send-otp
export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = sendOtpSchema.parse(req.body);

  // Rate-limit: block re-send if OTP still has > 4 min remaining
  const ttl = await OtpService.otpTtl(email);
  if (ttl > 240) {
    throw new TooManyRequestsError(`Wait ${Math.ceil((ttl - 240) / 60)} min before requesting a new OTP`);
  }

  const otp = await OtpService.generateOtp(email);
  const existingUser = await User.findOne({ email }).select('name');
  
  try {
    await EmailService.sendOtpEmail(email, otp, existingUser?.name);
  } catch (error) {
    console.warn(`⚠️  [PawMart Auth] SMTP Email service failed, falling back to console print.`);
  }

  console.log(`\n🔑🔑🔑 [PawMart OTP Login for ${email}]: ${otp} 🔑🔑🔑\n`);

  sendSuccess(res, { ttl: 300 }, 'OTP sent to your email');
});

// POST /api/auth/verify-otp
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = verifyOtpSchema.parse(req.body);

  const result = await OtpService.verifyOtp(email, otp);
  if (!result.valid) throw new BadRequestError(result.reason);

  const { user, tokens, isNew } = await AuthService.loginOrRegisterByEmail(email);

  sendSuccess(
    res,
    { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, tokens, isNew },
    isNew ? 'Account created successfully' : 'Login successful'
  );
});

// POST /api/auth/refresh
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;
  if (!token) throw new BadRequestError('Refresh token required');
  const accessToken = await AuthService.refreshAccessToken(token);
  sendSuccess(res, { accessToken }, 'Token refreshed');
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, req.user, 'Profile fetched');
});

// PATCH /api/auth/me
export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const data = updateProfileSchema.parse(req.body);
  const updated = await User.findByIdAndUpdate(req.user!._id, data, { new: true, runValidators: true });
  sendSuccess(res, updated, 'Profile updated');
});
