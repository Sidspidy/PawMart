import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  variant?: string;
  sku: string;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  subtotal: number;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: String },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    items: { type: [CartItemSchema], default: [] },
    subtotal: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, versionKey: false }
);

CartSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
