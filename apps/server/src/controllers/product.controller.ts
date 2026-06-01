import { Request, Response } from 'express';
import slugify from '../utils/slugify';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, buildPagination } from '../utils/apiResponse';
import { NotFoundError } from '../utils/AppError';
import { createProductSchema } from '../utils/validators';
import { Product } from '../models/Product.model';

// GET /api/products
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 12);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { isActive: true };
  if (req.query.petCategory) filter.petCategory = req.query.petCategory;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.brand) filter.brand = req.query.brand;
  if (req.query.isFeatured === 'true') filter.isFeatured = true;
  if (req.query.minPrice || req.query.maxPrice) {
    filter.basePrice = {
      ...(req.query.minPrice ? { $gte: Number(req.query.minPrice) } : {}),
      ...(req.query.maxPrice ? { $lte: Number(req.query.maxPrice) } : {}),
    };
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    price_asc: { basePrice: 1 },
    price_desc: { basePrice: -1 },
    rating: { averageRating: -1 },
    bestseller: { soldCount: -1 },
  };
  const sort = sortMap[(req.query.sort as string) ?? 'newest'] ?? { createdAt: -1 };

  if (req.query.q) {
    filter.$text = { $search: req.query.q as string };
  }

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).populate('category', 'name slug'),
    Product.countDocuments(filter),
  ]);

  sendSuccess(res, products, 'Products fetched', 200, buildPagination(page, limit, total));
});

// GET /api/products/:slug
export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('category', 'name slug petCategory');
  if (!product) throw new NotFoundError('Product not found');
  sendSuccess(res, product, 'Product fetched');
});

// POST /api/products  [Admin]
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = createProductSchema.parse(req.body);
  const slug = slugify(data.name, { lower: true, strict: true });
  const product = await Product.create({ ...data, slug });
  sendCreated(res, product, 'Product created');
});

// PATCH /api/products/:id  [Admin]
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const updates = req.body;
  if (updates.name) updates.slug = slugify(updates.name, { lower: true, strict: true });
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!product) throw new NotFoundError('Product not found');
  sendSuccess(res, product, 'Product updated');
});

// DELETE /api/products/:id  [Admin]
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) throw new NotFoundError('Product not found');
  sendSuccess(res, null, 'Product deactivated');
});
