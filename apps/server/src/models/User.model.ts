import mongoose, { Document, Schema } from 'mongoose';

// ── Enums ─────────────────────────────────────────────────────────────────────
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
}

// ── Sub-documents ─────────────────────────────────────────────────────────────
export interface IAddress {
  _id?: mongoose.Types.ObjectId;
  label: string; // home | work | other
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

const AddressSchema = new Schema<IAddress>(
  {
    label: { type: String, default: 'home' },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

// ── Main Interface ────────────────────────────────────────────────────────────
export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  provider: AuthProvider;
  googleId?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  addresses: IAddress[];
  pointsBalance: number;
  totalSpins: number;
  wishlist: mongoose.Types.ObjectId[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ── Schema ────────────────────────────────────────────────────────────────────
const UserSchema = new Schema<IUser>(
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
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.EMAIL,
    },
    googleId: { type: String, sparse: true },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    addresses: { type: [AddressSchema], default: [] },
    pointsBalance: { type: Number, default: 0, min: 0 },
    totalSpins: { type: Number, default: 0, min: 0 },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', UserSchema);
