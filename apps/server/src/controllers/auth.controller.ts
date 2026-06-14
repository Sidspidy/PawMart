import { Request, Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { BadRequestError, TooManyRequestsError, UnauthorizedError } from '../utils/AppError';
import { sendOtpSchema, verifyOtpSchema, updateProfileSchema } from '../utils/validators';
import * as OtpService from '../services/otp.service';
import * as AuthService from '../services/auth.service';
import * as EmailService from '../services/email.service';
import { Customer } from '../models/Customer.model';
import { Admin } from '../models/Admin.model';

// ── Customer Validation Schemas ───────────────────────────────────────────────
const customerLoginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const customerRegisterSchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

const customerForgotPasswordVerifySchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

// ── Customer Auth Actions ─────────────────────────────────────────────────────

// POST /api/auth/login
export const loginCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = customerLoginSchema.parse(req.body);
  const { customer, tokens } = await AuthService.loginCustomer(email, password);

  sendSuccess(
    res,
    {
      user: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        avatar: customer.avatar,
        pointsBalance: customer.pointsBalance || 0,
        totalSpins: customer.totalSpins || 0,
        role: 'customer'
      },
      tokens
    },
    'Login successful'
  );
});

// POST /api/auth/register/send-otp
export const sendRegisterOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = sendOtpSchema.parse(req.body);

  const existing = await Customer.findOne({ email });
  if (existing) {
    throw new BadRequestError('Email already registered');
  }

  const ttl = await OtpService.otpTtl(email);
  if (ttl > 240) {
    throw new TooManyRequestsError(`Wait ${Math.ceil((ttl - 240) / 60)} min before requesting a new OTP`);
  }

  const otp = await OtpService.generateOtp(email);

  try {
    await EmailService.sendOtpEmail(email, otp, email.split('@')[0]);
  } catch (error) {
    console.warn(`⚠️  [Register OTP] SMTP failed, console print fallback.`);
  }

  console.log(`\n🔑🔑🔑 [Customer Register OTP for ${email}]: ${otp} 🔑🔑🔑\n`);

  sendSuccess(res, { ttl: 300 }, 'OTP sent to your email');
});

// POST /api/auth/register/verify
export const verifyRegisterAndCreate = asyncHandler(async (req: Request, res: Response) => {
  const { email, name, phone, password, otp } = customerRegisterSchema.parse(req.body);

  const otpResult = await OtpService.verifyOtp(email, otp);
  if (!otpResult.valid) {
    throw new BadRequestError(otpResult.reason || 'Invalid OTP code');
  }

  const { customer, tokens } = await AuthService.registerCustomer(email, name, phone, password);

  sendSuccess(
    res,
    {
      user: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        avatar: customer.avatar,
        pointsBalance: customer.pointsBalance || 0,
        totalSpins: customer.totalSpins || 0,
        role: 'customer'
      },
      tokens
    },
    'Registration successful'
  );
});

// POST /api/auth/forgot-password/send-otp
export const sendForgotPasswordOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = sendOtpSchema.parse(req.body);

  const existing = await Customer.findOne({ email });
  if (!existing) {
    throw new BadRequestError('Account with this email does not exist');
  }

  const ttl = await OtpService.otpTtl(email);
  if (ttl > 240) {
    throw new TooManyRequestsError(`Wait ${Math.ceil((ttl - 240) / 60)} min before requesting a new OTP`);
  }

  const otp = await OtpService.generateOtp(email);

  try {
    await EmailService.sendOtpEmail(email, otp, existing.name);
  } catch (error) {
    console.warn(`⚠️  [Forgot Password OTP] SMTP failed, console print fallback.`);
  }

  console.log(`\n🔑🔑🔑 [Customer Forgot Password OTP for ${email}]: ${otp} 🔑🔑🔑\n`);

  sendSuccess(res, { ttl: 300 }, 'OTP sent to your email');
});

// POST /api/auth/forgot-password/verify
export const verifyForgotPasswordAndReset = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, otp } = customerForgotPasswordVerifySchema.parse(req.body);

  const otpResult = await OtpService.verifyOtp(email, otp);
  if (!otpResult.valid) {
    throw new BadRequestError(otpResult.reason || 'Invalid OTP code');
  }

  await AuthService.resetCustomerPassword(email, password);

  sendSuccess(res, null, 'Password reset successful. You can now login.');
});

// ── Admin Auth Actions ────────────────────────────────────────────────────────

// POST /api/auth/send-otp
export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = sendOtpSchema.parse(req.body);

  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new UnauthorizedError('Authorized administrative staff only. Account not found.');
  }

  const ttl = await OtpService.otpTtl(email);
  if (ttl > 240) {
    throw new TooManyRequestsError(`Wait ${Math.ceil((ttl - 240) / 60)} min before requesting a new OTP`);
  }

  const otp = await OtpService.generateOtp(email);

  try {
    await EmailService.sendOtpEmail(email, otp, admin.name);
  } catch (error) {
    console.warn(`⚠️  [Admin OTP] SMTP failed, console print fallback.`);
  }

  console.log(`\n🔑🔑🔑 [Admin OTP Login for ${email}]: ${otp} 🔑🔑🔑\n`);

  sendSuccess(res, { ttl: 300 }, 'OTP sent to your email');
});

// POST /api/auth/verify-otp
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = verifyOtpSchema.parse(req.body);

  const result = await OtpService.verifyOtp(email, otp);
  if (!result.valid) throw new BadRequestError(result.reason);

  const { user, tokens } = await AuthService.adminLoginByEmail(email);

  sendSuccess(
    res,
    { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, tokens },
    'Login successful'
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
  const u = req.user as any;
  if (u.role === 'customer') {
    // Re-fetch to get latest pointsBalance and totalSpins
    const customer = await Customer.findById(u._id).select('-password -__v');
    if (!customer) throw new UnauthorizedError('User not found');
    sendSuccess(res, {
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      avatar: customer.avatar,
      pointsBalance: customer.pointsBalance || 0,
      totalSpins: customer.totalSpins || 0,
      role: 'customer',
      isActive: customer.isActive,
      wishlist: customer.wishlist || [],
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    }, 'Profile fetched');
  } else {
    sendSuccess(res, u, 'Profile fetched');
  }
});

// PATCH /api/auth/me
export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const data = updateProfileSchema.parse(req.body);

  if (req.user!.role === 'customer') {
    const updated = await Customer.findByIdAndUpdate(req.user!._id, data, { new: true, runValidators: true }).select('-password -__v');
    if (!updated) throw new UnauthorizedError('User not found');
    sendSuccess(res, {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone || '',
      avatar: updated.avatar,
      pointsBalance: updated.pointsBalance || 0,
      totalSpins: updated.totalSpins || 0,
      role: 'customer',
    }, 'Profile updated');
  } else {
    const updated = await Admin.findByIdAndUpdate(req.user!._id, data, { new: true, runValidators: true });
    sendSuccess(res, updated, 'Profile updated');
  }
});
