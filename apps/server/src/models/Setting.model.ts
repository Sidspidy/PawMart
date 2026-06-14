import mongoose, { Document, Schema } from 'mongoose';

export interface ISetting extends Document {
  shopName: string;
  currency: string;
  autoEmailReceipt: boolean;
  maintenanceMode: boolean;
}

const SettingSchema = new Schema<ISetting>(
  {
    shopName: { type: String, default: 'PawMart Storefront' },
    currency: { type: String, default: 'INR (₹)' },
    autoEmailReceipt: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
  },
  { 
    timestamps: true,
    versionKey: false 
  }
);

export const Setting = mongoose.model<ISetting>('Setting', SettingSchema);
