import mongoose, { Document, Schema } from 'mongoose';

export enum PointsTransactionType {
  EARNED_ORDER = 'earned_order',
  EARNED_SPIN = 'earned_spin',
  REDEEMED_ORDER = 'redeemed_order',
  REDEEMED_COUPON = 'redeemed_coupon',
  ADMIN_CREDIT = 'admin_credit',
  ADMIN_DEBIT = 'admin_debit',
  EXPIRED = 'expired',
}

export interface IPointsTransaction extends Document {
  user: mongoose.Types.ObjectId;
  type: PointsTransactionType;
  points: number;
  balanceAfter: number;
  reference?: mongoose.Types.ObjectId;
  referenceModel?: string;
  description: string;
  expiresAt?: Date;
  createdAt: Date;
}

const PointsSchema = new Schema<IPointsTransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: Object.values(PointsTransactionType), required: true },
    points: { type: Number, required: true },
    balanceAfter: { type: Number, required: true, min: 0 },
    reference: { type: Schema.Types.ObjectId, refPath: 'referenceModel' },
    referenceModel: { type: String, enum: ['Order', 'SpinResult'] },
    description: { type: String, required: true },
    expiresAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

PointsSchema.index({ user: 1, createdAt: -1 });

export const Points = mongoose.model<IPointsTransaction>('Points', PointsSchema);
