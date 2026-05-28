import mongoose, { Document, Schema } from 'mongoose';

// ── Enums ─────────────────────────────────────────────────────────────────────
export enum PetCategory {
  DOGS = 'dogs',
  CATS = 'cats',
  FISH = 'fish',
  BIRDS = 'birds',
  SMALL_PETS = 'small_pets',
}

// ── Sub-documents ─────────────────────────────────────────────────────────────
export interface IProductImage {
  url: string;
  publicId: string;
  alt?: string;
  isPrimary: boolean;
}

export interface IProductVariant {
  sku: string;
  label: string; // e.g. "500g", "Large", "Blue"
  price: number;
  comparePrice?: number;
  stock: number;
  weight?: number; // grams
}

// ── Main Interface ────────────────────────────────────────────────────────────
export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: mongoose.Types.ObjectId;
  petCategory: PetCategory;
  brand?: string;
  tags: string[];
  images: IProductImage[];
  variants: IProductVariant[];
  basePrice: number;
  comparePrice?: number;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  weight?: number; // grams
  isFeatured: boolean;
  isActive: boolean;
  isBestseller: boolean;
  isNew: boolean;
  averageRating: number;
  reviewCount: number;
  soldCount: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    sku: { type: String, required: true },
    label: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    weight: { type: Number },
  },
  { _id: false }
);

// ── Schema ────────────────────────────────────────────────────────────────────
const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    petCategory: {
      type: String,
      enum: Object.values(PetCategory),
      required: true,
      index: true,
    },
    brand: { type: String, trim: true },
    tags: { type: [String], default: [] },
    images: { type: [ProductImageSchema], default: [] },
    variants: { type: [ProductVariantSchema], default: [] },
    basePrice: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    sku: { type: String, required: true, unique: true, trim: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    weight: { type: Number },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBestseller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    soldCount: { type: Number, default: 0, min: 0 },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
ProductSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
ProductSchema.index({ petCategory: 1, isActive: 1 });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ basePrice: 1 });
ProductSchema.index({ averageRating: -1 });
ProductSchema.index({ soldCount: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
