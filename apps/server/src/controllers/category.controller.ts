import { Request, Response } from 'express';
import slugify from 'slugify';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { NotFoundError } from '../utils/AppError';
import { Category } from '../models/Category.model';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = { isActive: true };
  if (req.query.petCategory) filter.petCategory = req.query.petCategory;
  if (req.query.parent) filter.parent = req.query.parent === 'null' ? null : req.query.parent;

  const categories = await Category.find(filter)
    .sort({ sortOrder: 1, name: 1 })
    .populate('parent', 'name slug');

  sendSuccess(res, categories, 'Categories fetched');
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true }).populate('parent', 'name slug');
  if (!category) throw new NotFoundError('Category not found');
  sendSuccess(res, category, 'Category fetched');
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, ...rest } = req.body;
  const slug = slugify(name, { lower: true, strict: true });
  const category = await Category.create({ name, slug, ...rest });
  sendCreated(res, category, 'Category created');
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const updates = req.body;
  if (updates.name) updates.slug = slugify(updates.name, { lower: true, strict: true });
  const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!category) throw new NotFoundError('Category not found');
  sendSuccess(res, category, 'Category updated');
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!category) throw new NotFoundError('Category not found');
  sendSuccess(res, null, 'Category deactivated');
});
