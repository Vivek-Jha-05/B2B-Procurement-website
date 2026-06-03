import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import Admin from '../models/Admin';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';

const router = Router();

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// POST /api/auth/login
router.post(
  '/login',
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body as z.infer<typeof loginSchema>;

      const admin = await Admin.findOne({ email });
      if (!admin) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const isValid = await admin.comparePassword(password);
      if (!isValid) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const jwtSecret = process.env.JWT_SECRET;
      const refreshSecret = process.env.JWT_REFRESH_SECRET;

      if (!jwtSecret || !refreshSecret) {
        throw new Error('JWT secrets are not configured');
      }

      const payload = { id: admin._id.toString(), email: admin.email, role: admin.role };

      const token = jwt.sign(payload, jwtSecret, { expiresIn: '15m' });
      const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/api/auth',
      });

      res.json({
        token,
        expiresIn: 900, // 15 minutes in seconds
        user: {
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/logout
router.post('/logout', requireAuth, (_req: Request, res: Response): void => {
  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.json({ message: 'Logged out successfully' });
});

// POST /api/auth/refresh
router.post(
  '/refresh',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken as string | undefined;

      if (!refreshToken) {
        res.status(401).json({ error: 'Refresh token not found' });
        return;
      }

      const refreshSecret = process.env.JWT_REFRESH_SECRET;
      const jwtSecret = process.env.JWT_SECRET;

      if (!refreshSecret || !jwtSecret) {
        throw new Error('JWT secrets are not configured');
      }

      const decoded = jwt.verify(refreshToken, refreshSecret) as {
        id: string;
        email: string;
        role: string;
      };

      // Verify admin still exists in DB (handles deleted admin accounts)
      const admin = await Admin.findById(decoded.id).select('email role').lean();
      if (!admin) {
        res.clearCookie('refreshToken', { path: '/' });
        res.status(401).json({ error: 'Account no longer exists' });
        return;
      }

      const payload = { id: decoded.id, email: admin.email, role: admin.role };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: '15m' });

      res.json({
        token,
        expiresIn: 900,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
