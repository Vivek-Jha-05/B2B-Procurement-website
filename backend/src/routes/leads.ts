import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import Lead from '../models/Lead';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const statusSchema = z.object({
  status: z.enum(['new', 'contacted', 'closed'], {
    errorMap: () => ({ message: 'Status must be new, contacted, or closed' }),
  }),
});

// All routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole(['admin', 'super_admin']));

// GET /api/leads — Paginated list
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(req.query.limit as string) || 20)
      );
      const status = req.query.status as string | undefined;
      const skip = (page - 1) * limit;

      const filter: Record<string, string> = {};
      if (status && ['new', 'contacted', 'closed'].includes(status)) {
        filter.status = status;
      }

      const [data, total] = await Promise.all([
        Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Lead.countDocuments(filter),
      ]);

      res.json({
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/leads/:id/status
router.patch(
  '/:id/status',
  validate(statusSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid lead ID' });
        return;
      }

      const lead = await Lead.findByIdAndUpdate(
        id,
        { $set: { status: req.body.status } },
        { new: true, runValidators: true }
      );

      if (!lead) {
        res.status(404).json({ error: 'Lead not found' });
        return;
      }

      res.json(lead);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/leads/:id
router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid lead ID' });
        return;
      }

      const lead = await Lead.findByIdAndDelete(id);

      if (!lead) {
        res.status(404).json({ error: 'Lead not found' });
        return;
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
