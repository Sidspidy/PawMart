import { z } from 'zod';

// ── Auth validators ───────────────────────────────────────────────────────────
export const sendOtpSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email().toLowerCase(),
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number')
    .optional(),
  avatar: z.string().url().optional(),
});

export const addAddressSchema = z.object({
  label: z.enum(['home', 'work', 'other']).default('home'),
  fullName: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone'),
  line1: z.string().min(3).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  country: z.string().default('India'),
  isDefault: z.boolean().default(false),
});

// ── Product validators ────────────────────────────────────────────────────────
export const createProductSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(10),
  shortDescription: z.string().max(300).optional(),
  category: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid category ID'),
  petCategory: z.enum(['dogs', 'cats', 'fish', 'birds', 'small_pets']),
  brand: z.string().max(100).optional(),
  tags: z.array(z.string()).default([]),
  basePrice: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  sku: z.string().min(2).max(100),
  stock: z.number().int().nonnegative(),
  lowStockThreshold: z.number().int().nonnegative().default(5),
  weight: z.number().positive().optional(),
  isFeatured: z.boolean().default(false),
});

// ── Coupon validators ─────────────────────────────────────────────────────────
export const createCouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  description: z.string().optional(),
  type: z.enum(['percentage', 'flat', 'free_shipping']),
  scope: z.enum(['global', 'category', 'user', 'product']).default('global'),
  value: z.number().nonnegative(),
  minOrderValue: z.number().nonnegative().default(0),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().nonnegative().default(0),
  usagePerUser: z.number().int().nonnegative().default(1),
  startsAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  applicableCategories: z.array(z.string()).default([]),
  applicableProducts: z.array(z.string()).default([]),
  applicableUsers: z.array(z.string()).default([]),
});

// ── Order validators ──────────────────────────────────────────────────────────
export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string().regex(/^[a-f\d]{24}$/i),
        variant: z.string().optional(),
        sku: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .min(1),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    line1: z.string().min(3),
    line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().regex(/^\d{6}$/),
    country: z.string().default('India'),
  }),
  paymentMethod: z.enum(['razorpay', 'stripe', 'cashfree', 'cod']),
  couponCode: z.string().optional(),
  pointsToRedeem: z.number().int().nonnegative().default(0),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
