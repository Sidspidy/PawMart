import mongoose, { Document, Schema } from 'mongoose';

export enum PrizeType {
  COUPON = 'coupon',
  FREE_SHIPPING = 'free_shipping',
  POINTS = 'points',
  GIFT = 'gift',
  NO_PRIZE = 'no_prize',
}

export interface ISpinResult extends Document {
  user: mongoose.Types.ObjectId;
  prizeType: PrizeType;
  prizeValue?: number;
  couponCode?: string;
  pointsAwarded: number;
  description: string;
  claimedAt?: Date;
  isClaimed: boolean;
  createdAt: Date;
}

const SpinResultSchema = new Schema<ISpinResult>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    prizeType: { type: String, enum: Object.values(PrizeType), required: true },
    prizeValue: { type: Number },
    couponCode: { type: String },
    pointsAwarded: { type: Number, default: 0 },
    description: { type: String, required: true },
    claimedAt: { type: Date },
    isClaimed: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

SpinResultSchema.index({ user: 1, createdAt: -1 });

export const SpinResult = mongoose.model<ISpinResult>('SpinResult', SpinResultSchema);
