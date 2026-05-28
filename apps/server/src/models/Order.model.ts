import mongoose, { Document, Schema } from 'mongoose';

// ── Enums ─────────────────────────────────────────────────────────────────────
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PACKED = 'packed',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentMethod {
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe',
  CASHFREE = 'cashfree',
  COD = 'cod',
}

// ── Sub-documents ─────────────────────────────────────────────────────────────
export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  productImage: string;
  variant?: string;
  sku: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface IStatusHistory {
  status: OrderStatus;
  note?: string;
  timestamp: Date;
  updatedBy?: mongoose.Types.ObjectId;
}

// ── Main Interface ────────────────────────────────────────────────────────────
export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  status: OrderStatus;
  statusHistory: IStatusHistory[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  coupon?: mongoose.Types.ObjectId;
  couponCode?: string;
  pointsUsed: number;
  pointsEarned: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paymentOrderId?: string;
  paymentGatewayData?: Record<string, unknown>;
  notes?: string;
  trackingNumber?: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    variant: { type: String },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
  },
  { _id: false }
);

const StatusHistorySchema = new Schema<IStatusHistory>(
  {
    status: { type: String, enum: Object.values(OrderStatus), required: true },
    note: { type: String },
    timestamp: { type: Date, default: () => new Date() },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    statusHistory: { type: [StatusHistorySchema], default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' },
    couponCode: { type: String },
    pointsUsed: { type: Number, default: 0, min: 0 },
    pointsEarned: { type: Number, default: 0, min: 0 },
    paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paymentId: { type: String },
    paymentOrderId: { type: String },
    paymentGatewayData: { type: Schema.Types.Mixed },
    notes: { type: String },
    trackingNumber: { type: String },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

// ── Auto-generate order number ────────────────────────────────────────────────
OrderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.orderNumber = `PM-${timestamp}-${random}`;
  }
  next();
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
