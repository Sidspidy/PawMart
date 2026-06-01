import { Request, Response } from 'express';
import slugify from '../../utils/slugify';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendCreated, buildPagination } from '../../utils/apiResponse';
import { NotFoundError } from '../../utils/AppError';
import { createProductSchema } from '../../utils/validators';
import { Product } from '../../models/Product.model';

// GET /api/admin/products
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (req.query.petCategory) filter.petCategory = req.query.petCategory;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.brand) filter.brand = req.query.brand;
  
  if (req.query.q) {
    filter.name = { $regex: req.query.q as string, $options: 'i' };
  }

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category', 'name slug'),
    Product.countDocuments(filter),
  ]);

  sendSuccess(res, products, 'Admin products fetched', 200, buildPagination(page, limit, total));
});

// POST /api/admin/products
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = createProductSchema.parse(req.body);
  const slug = slugify(data.name, { lower: true, strict: true });
  const product = await Product.create({ ...data, slug });
  sendCreated(res, product, 'Product created');
});

// PATCH /api/admin/products/:id
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const updates = req.body;
  if (updates.name) updates.slug = slugify(updates.name, { lower: true, strict: true });
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!product) throw new NotFoundError('Product not found');
  sendSuccess(res, product, 'Product updated');
});

// DELETE /api/admin/products/:id
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new NotFoundError('Product not found');
  sendSuccess(res, null, 'Product deleted successfully');
});
