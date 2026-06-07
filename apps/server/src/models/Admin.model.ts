import mongoose, { Document, Schema } from 'mongoose';

// ── Enums ─────────────────────────────────────────────────────────────────────
export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
}

// ── Main Interface ────────────────────────────────────────────────────────────
export interface IAdmin extends Document {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: any;
  isActive: boolean;
  permissions: {
    products: boolean;
    orders: boolean;
    spinWheel: boolean;
    staffLogs: boolean;
  };
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ── Schema ────────────────────────────────────────────────────────────────────
const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, trim: true },
    avatar: { type: String },
    role: {
      type: String,
      enum: Object.values(AdminRole),
      default: AdminRole.STAFF,
    },
    isActive: { type: Boolean, default: true },
    permissions: {
      products: { type: Boolean, default: false },
      orders: { type: Boolean, default: true },
      spinWheel: { type: Boolean, default: false },
      staffLogs: { type: Boolean, default: false },
    },
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
AdminSchema.index({ email: 1 });
AdminSchema.index({ role: 1 });
AdminSchema.index({ createdAt: -1 });

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
