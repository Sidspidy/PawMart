import { Router } from 'express';
import { uploadImage, uploadImages, deleteImage } from '../../controllers/upload.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { isStaff } from '../../middlewares/rbac.middleware';
import { uploadSingle, uploadMultiple } from '../../middlewares/upload.middleware';

const router = Router();

router.use(authenticate, isStaff);

router.post('/image', uploadSingle('image'), uploadImage);
router.post('/images', uploadMultiple('images', 8), uploadImages);
router.delete('/image', deleteImage);

export default router;
