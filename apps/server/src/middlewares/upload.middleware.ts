import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import { BadRequestError } from '../utils/AppError';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError(`Unsupported file type: ${path.extname(file.originalname)}`));
  }
};

// Memory storage — buffers are piped to Cloudinary stream
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

// Named upload presets for convenience
export const uploadSingle = (field = 'image') => upload.single(field);
export const uploadMultiple = (field = 'images', max = 8) => upload.array(field, max);
export const uploadFields = (fields: multer.Field[]) => upload.fields(fields);
