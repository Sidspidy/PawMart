import mongoose, { Document, Schema } from 'mongoose';

export enum CouponType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
  FREE_SHIPPING = 'free_shipping',
}

export enum CouponScope {
  GLOBAL = 'global',
  CATEGORY = 'category',
  USER = 'user',
  PRODUCT = 'product',
}

export interface ICoupon extends Document {
  code: string;
  description?: string;
  type: CouponType;
  scope: CouponScope;
  value: number; // percentage (0-100) or flat amount
  minOrderValue: number;
  maxDiscount?: number; // cap for percentage discounts
  usageLimit: number; // total max uses (0 = unlimited)
  usagePerUser: number; // max per user (0 = unlimited)
  usedCount: number;
  applicableCategories: mongoose.Types.ObjectId[];
  applicableProducts: mongoose.Types.ObjectId[];
  applicableUsers: mongoose.Types.ObjectId[];
  isActive: boolean;
  startsAt: Date;
  expiresAt: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: { type: String },
    type: {
      type: String,
      enum: Object.values(CouponType),
      required: true,
    },
    scope: {
      type: String,
      enum: Object.values(CouponScope),
      default: CouponScope.GLOBAL,
    },
    value: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0, min: 0 },
    maxDiscount: { type: Number, min: 0 },
    usageLimit: { type: Number, default: 0, min: 0 },
    usagePerUser: { type: Number, default: 1, min: 0 },
    usedCount: { type: Number, default: 0, min: 0 },
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    applicableUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
    startsAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1, expiresAt: 1 });

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);
