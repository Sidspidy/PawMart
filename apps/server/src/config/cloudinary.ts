import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

// ── Upload presets ────────────────────────────────────────────────────────────
export const UPLOAD_FOLDERS = {
  PRODUCTS: 'pawmart/products',
  CATEGORIES: 'pawmart/categories',
  AVATARS: 'pawmart/avatars',
  BANNERS: 'pawmart/banners',
} as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[keyof typeof UPLOAD_FOLDERS];
