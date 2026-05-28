import { Request, Response } from 'express';
import streamifier from 'streamifier';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { BadRequestError } from '../utils/AppError';
import { cloudinary, UPLOAD_FOLDERS, UploadFolder } from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

const streamUpload = (
  buffer: Buffer,
  folder: string,
  options: Record<string, unknown> = {}
): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', ...options },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// POST /api/upload/image?folder=products|categories|avatars|banners
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new BadRequestError('No file provided');

  const folderKey = ((req.query.folder as string) ?? 'products').toUpperCase() as keyof typeof UPLOAD_FOLDERS;
  const folder: UploadFolder = UPLOAD_FOLDERS[folderKey] ?? UPLOAD_FOLDERS.PRODUCTS;

  const result = await streamUpload(req.file.buffer, folder, {
    transformation: [{ width: 1200, crop: 'limit', quality: 'auto:good', fetch_format: 'webp' }],
  });

  sendSuccess(
    res,
    { url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height },
    'Image uploaded'
  );
});

// POST /api/upload/images  (multiple — max 8)
export const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files?.length) throw new BadRequestError('No files provided');

  const folderKey = ((req.query.folder as string) ?? 'products').toUpperCase() as keyof typeof UPLOAD_FOLDERS;
  const folder: UploadFolder = UPLOAD_FOLDERS[folderKey] ?? UPLOAD_FOLDERS.PRODUCTS;

  const uploads = await Promise.all(
    files.map((f) =>
      streamUpload(f.buffer, folder, {
        transformation: [{ width: 1200, crop: 'limit', quality: 'auto:good', fetch_format: 'webp' }],
      })
    )
  );

  const data = uploads.map((r) => ({ url: r.secure_url, publicId: r.public_id }));
  sendSuccess(res, data, `${data.length} image(s) uploaded`);
});

// DELETE /api/upload/image
export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  const { publicId } = req.body;
  if (!publicId) throw new BadRequestError('publicId required');
  await cloudinary.uploader.destroy(publicId);
  sendSuccess(res, null, 'Image deleted');
});
