import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import crypto from 'crypto';
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

      // Save hashed refresh token to the database
      const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
      admin.refreshTokens = admin.refreshTokens || [];
      admin.refreshTokens.push(hashedToken);
      admin.markModified('refreshTokens');
      await admin.save();

      // Set refresh token as httpOnly cookie dynamically based on environment
      const isProd = process.env.NODE_ENV === 'production';
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
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
router.post(
  '/logout',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken as string | undefined;

      if (refreshToken && req.user) {
        const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        await Admin.findByIdAndUpdate(req.user.id, {
          $pull: { refreshTokens: hashedToken },
        });
      }

      const isProd = process.env.NODE_ENV === 'production';
      res.clearCookie('refreshToken', {
        path: '/api/auth',
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
      });

      res.json({ message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }
);

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

      let decoded: { id: string; email: string; role: string };
      const isProd = process.env.NODE_ENV === 'production';

      try {
        decoded = jwt.verify(refreshToken, refreshSecret) as {
          id: string;
          email: string;
          role: string;
        };
      } catch (err) {
        // Clear invalid/expired cookie from client
        res.clearCookie('refreshToken', {
          path: '/api/auth',
          secure: isProd,
          sameSite: isProd ? 'none' : 'lax',
        });

        // Clean up from database
        try {
          const unverifiedDecoded = jwt.decode(refreshToken) as { id?: string } | null;
          if (unverifiedDecoded?.id) {
            const expiredHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
            await Admin.findByIdAndUpdate(unverifiedDecoded.id, {
              $pull: { refreshTokens: expiredHash },
            });
          }
        } catch (_) {
          // Ignore cleanup failures
        }

        res.status(401).json({ error: 'Session expired or invalid' });
        return;
      }

      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        res.clearCookie('refreshToken', {
          path: '/api/auth',
          secure: isProd,
          sameSite: isProd ? 'none' : 'lax',
        });
        res.status(401).json({ error: 'Account no longer exists' });
        return;
      }

      const incomingHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      admin.refreshTokens = admin.refreshTokens || [];

      // Token Reuse Detection
      if (!admin.refreshTokens.includes(incomingHash)) {
        // Token has already been used or was stolen. Revoke ALL active sessions for safety.
        admin.refreshTokens = [];
        await admin.save();

        res.clearCookie('refreshToken', {
          path: '/api/auth',
          secure: isProd,
          sameSite: isProd ? 'none' : 'lax',
        });
        res.status(401).json({ error: 'Access denied: session compromise detected' });
        return;
      }

      // Rotate Token: pull old, push new
      admin.refreshTokens = (admin.refreshTokens || []).filter((t) => t !== incomingHash);

      const payload = { id: admin._id.toString(), email: admin.email, role: admin.role };
      const newAccessToken = jwt.sign(payload, jwtSecret, { expiresIn: '15m' });
      const newRefreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

      const newHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
      admin.refreshTokens.push(newHash);
      admin.markModified('refreshTokens');
      await admin.save();

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/api/auth',
      });

      res.json({
        token: newAccessToken,
        expiresIn: 900,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
