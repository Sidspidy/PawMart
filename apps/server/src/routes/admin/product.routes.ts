import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../controllers/admin/product.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { isStaff } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate, isStaff);

router.get('/', getProducts);
router.post('/', createProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
