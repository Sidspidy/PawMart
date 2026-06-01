import { Request, Response } from 'express';
import mongoose from 'mongoose';
import slugify from '../../utils/slugify';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../../utils/apiResponse';
import { NotFoundError } from '../../utils/AppError';
import { Category } from '../../models/Category.model';
import { Product } from '../../models/Product.model';

// GET /api/admin/categories  (with live productCount injected)
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.petCategory) filter.petCategory = req.query.petCategory;
  if (req.query.parent) filter.parent = req.query.parent === 'null' ? null : req.query.parent;

  // Fetch categories from DB
  const categories = await Category.find(filter)
    .sort({ sortOrder: 1, name: 1 })
    .populate('parent', 'name slug')
    .lean();

  if (categories.length === 0) {
    sendSuccess(res, [], 'All admin categories fetched');
    return;
  }

  // Aggregate live product counts per category in a single query
  const categoryIds = categories.map(c => c._id as mongoose.Types.ObjectId);
  const countAgg = await Product.aggregate([
    { $match: { category: { $in: categoryIds } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  // Build a lookup map: categoryId -> count
  const countMap: Record<string, number> = {};
  for (const row of countAgg) {
    countMap[row._id.toString()] = row.count;
  }

  // Inject live productCount into each category
  const withCounts = categories.map(cat => ({
    ...cat,
    productCount: countMap[(cat._id as mongoose.Types.ObjectId).toString()] ?? 0,
  }));

  sendSuccess(res, withCounts, 'All admin categories fetched');
});

// POST /api/admin/categories
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, ...rest } = req.body;
  const slug = slugify(name, { lower: true, strict: true });
  const category = await Category.create({ name, slug, ...rest });
  sendCreated(res, category, 'Category created');
});

// PATCH /api/admin/categories/:id
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const updates = req.body;
  if (updates.name) updates.slug = slugify(updates.name, { lower: true, strict: true });
  const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!category) throw new NotFoundError('Category not found');
  sendSuccess(res, category, 'Category updated');
});

// DELETE /api/admin/categories/:id
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new NotFoundError('Category not found');
  sendSuccess(res, null, 'Category deleted successfully');
});
