import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
  stack?: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: unknown;

  // ── Known operational errors ─────────────────────────────────────────────
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // ── Zod validation errors ────────────────────────────────────────────────
  else if (err instanceof ZodError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = err.flatten().fieldErrors;
  }

  // ── Mongoose CastError (invalid ObjectId) ────────────────────────────────
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ── Mongoose ValidationError ─────────────────────────────────────────────
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = Object.fromEntries(
      Object.entries(err.errors).map(([key, val]) => [key, val.message])
    );
  }

  // ── MongoDB duplicate key ─────────────────────────────────────────────────
  else if ((err as { code?: number }).code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue ?? {})[0];
    message = `Duplicate value for field: ${field}`;
  }

  // ── JWT errors ────────────────────────────────────────────────────────────
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  const response: ErrorResponse = { success: false, message };
  if (errors) response.errors = errors;
  if (env.NODE_ENV === 'development') response.stack = err.stack;

  console.error(`[${req.method}] ${req.path} → ${statusCode}:`, err.message);

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
