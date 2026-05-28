import { Router } from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/rbac.middleware';

const router = Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', authenticate, isAdmin, createProduct);
router.patch('/:id', authenticate, isAdmin, updateProduct);
router.delete('/:id', authenticate, isAdmin, deleteProduct);

export default router;
