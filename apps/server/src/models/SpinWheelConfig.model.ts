import mongoose, { Document, Schema } from 'mongoose';
import { PrizeType } from './SpinResult.model';

export interface ISpinWheelConfig extends Document {
  type: PrizeType;
  label: string;
  value?: number;
  probability: number;
  isActive: boolean;
}

const SpinWheelConfigSchema = new Schema<ISpinWheelConfig>(
  {
    type: { 
      type: String, 
      enum: Object.values(PrizeType), 
      required: true 
    },
    label: { type: String, required: true, trim: true },
    value: { type: Number, min: 0 },
    probability: { type: Number, required: true, min: 0, max: 1 },
    isActive: { type: Boolean, default: true }
  },
  { 
    timestamps: true, 
    versionKey: false 
  }
);

export const SpinWheelConfig = mongoose.model<ISpinWheelConfig>('SpinWheelConfig', SpinWheelConfigSchema);
