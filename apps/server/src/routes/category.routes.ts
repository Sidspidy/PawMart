import { Router } from 'express';
import { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/rbac.middleware';

const router = Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.post('/', authenticate, isAdmin, createCategory);
router.patch('/:id', authenticate, isAdmin, updateCategory);
router.delete('/:id', authenticate, isAdmin, deleteCategory);

export default router;
