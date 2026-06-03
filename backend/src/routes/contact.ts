import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Lead from '../models/Lead';
import { validate } from '../middleware/validate';
import {
  sendAdminNotification,
  sendContactConfirmation,
} from '../config/email';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  company: z.string().min(2, 'Company must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(3000, 'Message is too long'),
  honeypot: z.string().optional(),
  productName: z.string().optional(),
  productCategory: z.string().optional(),
});

// POST /api/contact — Public
router.post(
  '/',
  validate(contactSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, company, email, phone, message, honeypot, productName, productCategory } =
        req.body as z.infer<typeof contactSchema>;

      // Silently reject bots
      if (honeypot && honeypot.trim().length > 0) {
        res.status(200).json({ success: true, message: 'Enquiry received' });
        return;
      }

      // Build message — append product context if this is a quote request
      let fullMessage = message;
      if (productName) {
        fullMessage = `[Quote Request for: ${productName}${productCategory ? ` (${productCategory})` : ''}]\n\n${message}`;
      }

      // Create lead in database
      const lead = await Lead.create({ name, company, email, phone, message: fullMessage });

      // Send emails independently — one failure NEVER blocks the other
      const [adminResult, customerResult] = await Promise.allSettled([
        sendAdminNotification(lead),
        sendContactConfirmation(lead),
      ]);

      if (adminResult.status === 'rejected') {
        console.error('[Contact] Admin notification failed:', adminResult.reason?.message ?? adminResult.reason);
      }
      if (customerResult.status === 'rejected') {
        console.error('[Contact] Customer confirmation failed:', customerResult.reason?.message ?? customerResult.reason);
      }

      res.status(201).json({
        success: true,
        message: 'Enquiry received. Our team will contact you within 1-2 business days.',
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
