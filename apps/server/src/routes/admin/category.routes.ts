import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../controllers/admin/category.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { isStaff } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate, isStaff);

router.get('/', getCategories);
router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
