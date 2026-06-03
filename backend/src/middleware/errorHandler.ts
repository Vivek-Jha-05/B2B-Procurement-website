import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';

interface AppError extends Error {
  statusCode?: number;
  status?: string;
  code?: number;
  path?: string;
  value?: unknown;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Log in development
  if (!isProduction) {
    console.error('🔴 Error:', err);
  } else {
    console.error(`[ERROR] ${req.method} ${req.path}: ${err.message}`);
  }

  // Mongoose Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    res.status(400).json({
      error: 'Validation failed',
      details: messages,
    });
    return;
  }

  // Mongoose CastError (invalid ID format)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      error: `Invalid value for field: ${err.path}`,
    });
    return;
  }

  // MongoDB duplicate key error
  if ((err as AppError).code === 11000) {
    const field = Object.keys((err as AppError).keyValue || {})[0];
    res.status(409).json({
      error: `A record with this ${field} already exists`,
    });
    return;
  }

  // JWT errors
  if (err instanceof jwt.TokenExpiredError) {
    res.status(401).json({ error: 'Token has expired' });
    return;
  }

  if (err instanceof jwt.JsonWebTokenError) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const fieldErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json({
      error: 'Validation failed',
      details: fieldErrors,
    });
    return;
  }

  // Known status code errors
  if (err.statusCode) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  // Default 500 error
  res.status(500).json({
    error: isProduction ? 'An unexpected error occurred' : err.message,
  });
};

export default errorHandler;
