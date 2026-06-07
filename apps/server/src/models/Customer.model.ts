import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface ICustomer extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  pointsBalance: number;
  totalSpins: number;
  wishlist: mongoose.Types.ObjectId[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}



// ── Main Schema ───────────────────────────────────────────────────────────────
const CustomerSchema = new Schema<ICustomer>(
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
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    avatar: { type: String },
    role: { type: String, default: 'customer' },
    isActive: { type: Boolean, default: true },
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

// ── Pre-save bcrypt hashing ───────────────────────────────────────────────────
CustomerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// ── Compare Password Method ───────────────────────────────────────────────────
CustomerSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password || '');
};

// ── Indexes ───────────────────────────────────────────────────────────────────
CustomerSchema.index({ email: 1 });
CustomerSchema.index({ createdAt: -1 });

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
