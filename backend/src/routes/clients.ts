import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import Client from '../models/Client';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { uploadSingle, uploadBufferToCloudinary } from '../middleware/upload';
import cloudinary from '../config/cloudinary';

const router = Router();

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim(),
  logoUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

const updateClientSchema = clientSchema.partial();

// GET /api/clients — Public (Gets active clients for homepage showcase)
router.get(
  '/',
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clients = await Client.find({ isActive: true })
        .select('name logoUrl order isActive createdAt')
        .sort({ order: 1, name: 1 })
        .lean();

      // Cache for 60s, stale-while-revalidate for 5min
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      res.json(clients);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/clients/all — Admin only (Gets all clients including inactive ones)
router.get(
  '/all',
  requireAuth,
  requireRole(['admin', 'super_admin']),
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clients = await Client.find()
        .sort({ order: 1, name: 1 })
        .lean();
      res.json(clients);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/clients — Admin only
router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'super_admin']),
  validate(clientSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const client = await Client.create(req.body);
      res.status(201).json(client);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/clients/:id — Admin only
router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'super_admin']),
  validate(updateClientSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid client ID' });
        return;
      }

      const client = await Client.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!client) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }

      res.json(client);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/clients/:id — Admin only
router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin', 'super_admin']),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid client ID' });
        return;
      }

      const client = await Client.findById(id);

      if (!client) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }

      // Delete from Cloudinary if exists
      if (client.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(client.cloudinaryPublicId);
        } catch (cloudinaryErr) {
          console.error('Cloudinary deletion failed:', cloudinaryErr);
        }
      }

      await client.deleteOne();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/clients/:id/logo — Admin only (image upload)
router.post(
  '/:id/logo',
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
        res.status(400).json({ error: 'Invalid client ID' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'No image file provided' });
        return;
      }

      // Upload buffer to Cloudinary
      const cloudinaryResult = await uploadBufferToCloudinary(req.file.buffer, 'prosource/clients');

      // Delete old image from Cloudinary if it exists
      const existing = await Client.findById(id);
      if (existing?.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(existing.cloudinaryPublicId).catch(console.error);
      }

      const client = await Client.findByIdAndUpdate(
        id,
        {
          $set: {
            logoUrl: cloudinaryResult.secure_url,
            cloudinaryPublicId: cloudinaryResult.public_id,
          },
        },
        { new: true }
      );

      if (!client) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }

      res.json(client);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
