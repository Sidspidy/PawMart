import mongoose, { Document, Schema } from 'mongoose';
import { PetCategory } from './Product.model';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  petCategory: PetCategory;
  image?: {
    url: string;
    publicId: string;
  };
  banner?: {
    url: string;
    publicId: string;
  };
  parent?: mongoose.Types.ObjectId;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    petCategory: {
      type: String,
      enum: Object.values(PetCategory),
      required: true,
      index: true,
    },
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    banner: {
      url: { type: String },
      publicId: { type: String },
    },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    productCount: { type: Number, default: 0, min: 0 },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CategorySchema.index({ slug: 1 });
CategorySchema.index({ petCategory: 1, isActive: 1 });
CategorySchema.index({ parent: 1 });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
