import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import Category from '../models/Category';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { uploadSingle, uploadBufferToCloudinary } from '../middleware/upload';
import cloudinary from '../config/cloudinary';

const router = Router();

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description too long')
    .trim(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  order: z.number().int().min(0).optional(),
});

const updateCategorySchema = categorySchema.partial();

// GET /api/categories — Public
router.get(
  '/',
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await Category.find({ isActive: true })
        .select('name description imageUrl order createdAt')
        .sort({ order: 1, name: 1 })
        .lean();

      // Cache for 60s, stale-while-revalidate for 5min
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      res.json(categories);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/categories — Admin only
router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'super_admin']),
  validate(categorySchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await Category.create(req.body);
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/categories/:id — Admin only
router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'super_admin']),
  validate(updateCategorySchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
      }

      const category = await Category.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      res.json(category);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/categories/:id — Admin only
router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin', 'super_admin']),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
      }

      const category = await Category.findById(id);

      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      // Delete from Cloudinary if exists
      if (category.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(category.cloudinaryPublicId);
        } catch (cloudinaryErr) {
          console.error('Cloudinary deletion failed:', cloudinaryErr);
        }
      }

      await category.deleteOne();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/categories/:id/image — Admin only
router.post(
  '/:id/image',
  requireAuth,
  requireRole(['admin', 'super_admin']),
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
        res.status(400).json({ error: 'Invalid category ID' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'No image file provided' });
        return;
      }

      // Upload buffer to Cloudinary using upload_stream (v2 compatible)
      const cloudinaryResult = await uploadBufferToCloudinary(req.file.buffer, 'prosource/categories');

      // Delete old image from Cloudinary if it exists
      const existing = await Category.findById(id);
      if (existing?.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(existing.cloudinaryPublicId).catch(console.error);
      }

      const category = await Category.findByIdAndUpdate(
        id,
        {
          $set: {
            imageUrl: cloudinaryResult.secure_url,
            cloudinaryPublicId: cloudinaryResult.public_id,
          },
        },
        { new: true }
      );

      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      res.json(category);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
