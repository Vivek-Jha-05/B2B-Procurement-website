import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import Product from '../models/Product';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { uploadSingle, uploadBufferToCloudinary } from '../middleware/upload';
import cloudinary from '../config/cloudinary';

const router = Router();

const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long').trim(),
  category: z.string().min(1, 'Category is required').trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description too long')
    .trim(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

const updateProductSchema = productSchema.partial();

// GET /api/products — Public
router.get(
  '/',
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await Product.find({ isActive: true })
        .select('name category description imageUrl createdAt')
        .sort({ createdAt: -1 })
        .lean();

      // Cache for 60s, stale-while-revalidate for 5min
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      res.json(products);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/products — Admin only
router.post(
  '/',
  requireAuth,
  validate(productSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/products/:id — Admin only
router.put(
  '/:id',
  requireAuth,
  validate(updateProductSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid product ID' });
        return;
      }

      const product = await Product.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json(product);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/products/:id — Admin only
router.delete(
  '/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid product ID' });
        return;
      }

      const product = await Product.findById(id);

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      // Delete from Cloudinary if exists
      if (product.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(product.cloudinaryPublicId);
        } catch (cloudinaryErr) {
          console.error('Cloudinary deletion failed:', cloudinaryErr);
        }
      }

      await product.deleteOne();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/products/:id/image — Admin only
router.post(
  '/:id/image',
  requireAuth,
  (req: Request, res: Response, next: NextFunction): void => {
    uploadSingle(req, res, (err) => {
      if (err) next(err);
      else next();
    });
  },
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid product ID' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'No image file provided' });
        return;
      }

      // Upload buffer to Cloudinary using upload_stream (v2 compatible)
      const cloudinaryResult = await uploadBufferToCloudinary(req.file.buffer);

      // Delete old image from Cloudinary if it exists
      const existing = await Product.findById(id);
      if (existing?.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(existing.cloudinaryPublicId).catch(console.error);
      }

      const product = await Product.findByIdAndUpdate(
        id,
        {
          $set: {
            imageUrl: cloudinaryResult.secure_url,
            cloudinaryPublicId: cloudinaryResult.public_id,
          },
        },
        { new: true }
      );

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json(product);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
