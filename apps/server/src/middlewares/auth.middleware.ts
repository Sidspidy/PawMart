import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User.model';
import { UnauthorizedError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';

interface JwtPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Verifies Bearer JWT and attaches the full user document to req.user.
 * Throws 401 for missing/invalid/expired tokens.
 */
export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }

    const user = await User.findById(payload.userId).select('-__v');
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or deactivated');
    }

    req.user = user;
    next();
  }
);

/**
 * Optional auth — attaches user if token present but doesn't throw if missing.
 */
export const optionalAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return next();

    try {
      const token = authHeader.split(' ')[1];
      const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      const user = await User.findById(payload.userId);
      if (user?.isActive) req.user = user;
    } catch {
      // silently ignore
    }
    next();
  }
);
