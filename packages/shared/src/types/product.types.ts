export enum PetCategory {
  DOGS = 'dogs',
  CATS = 'cats',
  FISH = 'fish',
  BIRDS = 'birds',
  SMALL_PETS = 'small_pets',
}

export interface IProductImage {
  url: string;
  publicId: string;
  alt?: string;
  isPrimary: boolean;
}

export interface IProductVariant {
  sku: string;
  label: string;
  price: number;
  comparePrice?: number;
  stock: number;
  weight?: number;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string | ICategory;
  petCategory: PetCategory;
  brand?: string;
  tags: string[];
  images: IProductImage[];
  variants: IProductVariant[];
  basePrice: number;
  comparePrice?: number;
  sku: string;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  isBestseller: boolean;
  isNew: boolean;
  averageRating: number;
  reviewCount: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  petCategory: PetCategory;
  image?: { url: string; publicId: string };
  banner?: { url: string; publicId: string };
  parent?: string | ICategory;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
}
