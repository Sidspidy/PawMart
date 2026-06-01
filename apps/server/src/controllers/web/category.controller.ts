import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import { NotFoundError } from '../../utils/AppError';
import { Category } from '../../models/Category.model';

// GET /api/categories
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = { isActive: true };
  if (req.query.petCategory) filter.petCategory = req.query.petCategory;
  if (req.query.parent) filter.parent = req.query.parent === 'null' ? null : req.query.parent;

  const categories = await Category.find(filter)
    .sort({ sortOrder: 1, name: 1 })
    .populate('parent', 'name slug');

  sendSuccess(res, categories, 'Categories fetched');
});

// GET /api/categories/:slug
export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true }).populate('parent', 'name slug');
  if (!category) throw new NotFoundError('Category not found');
  sendSuccess(res, category, 'Category fetched');
});
