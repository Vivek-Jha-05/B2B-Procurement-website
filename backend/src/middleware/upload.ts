import multer from 'multer';
import { Request } from 'express';
import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

// Use memory storage — we pipe the buffer directly to Cloudinary v2
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, WebP, and AVIF images are allowed.'));
  }
};

export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('image');

/**
 * Upload a buffer directly to Cloudinary using upload_stream (v2 API).
 * Returns the Cloudinary response with secure_url and public_id.
 */
export function uploadBufferToCloudinary(
  buffer: Buffer,
  folder = 'prosource/products'
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 800, height: 600, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Upload failed'));
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

