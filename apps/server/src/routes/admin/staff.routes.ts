import { Router } from 'express';
import { getStaff, registerStaff, togglePermission, deleteStaff } from '../../controllers/admin/staff.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { isAdmin } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate, isAdmin);

router.get('/', getStaff);
router.post('/', registerStaff);
router.patch('/:id/permissions', togglePermission);
router.delete('/:id', deleteStaff);

export default router;
