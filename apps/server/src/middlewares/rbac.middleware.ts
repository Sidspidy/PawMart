import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User.model';
import { ForbiddenError, UnauthorizedError } from '../utils/AppError';

// Role hierarchy — higher index = more permissions
const ROLE_HIERARCHY: UserRole[] = [
  UserRole.CUSTOMER,
  UserRole.STAFF,
  UserRole.MANAGER,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

const getRoleLevel = (role: UserRole): number => ROLE_HIERARCHY.indexOf(role);

/**
 * Factory function that returns a middleware allowing only the specified roles.
 *
 * Usage:
 *   router.delete('/user/:id', authenticate, requireRole(UserRole.ADMIN), handler)
 *   router.get('/admin', authenticate, requireMinRole(UserRole.MANAGER), handler)
 */
export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new UnauthorizedError();
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Access denied. Required roles: ${roles.join(', ')}`
      );
    }
    next();
  };

/**
 * Grants access to the specified role AND any higher roles in the hierarchy.
 */
export const requireMinRole =
  (minRole: UserRole) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new UnauthorizedError();
    const userLevel = getRoleLevel(req.user.role);
    const minLevel = getRoleLevel(minRole);
    if (userLevel < minLevel) {
      throw new ForbiddenError(
        `Access denied. Minimum required role: ${minRole}`
      );
    }
    next();
  };

/**
 * Allows the resource owner OR users with a minimum role level.
 * Useful for "edit your own profile OR be an admin" patterns.
 */
export const requireOwnerOrRole =
  (getOwnerId: (req: Request) => string, minRole: UserRole = UserRole.ADMIN) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new UnauthorizedError();
    const ownerId = getOwnerId(req);
    const isOwner = req.user._id.toString() === ownerId;
    const hasRole = getRoleLevel(req.user.role) >= getRoleLevel(minRole);
    if (!isOwner && !hasRole) {
      throw new ForbiddenError('Access denied');
    }
    next();
  };

// ── Shorthand role guards ────────────────────────────────────────────────────
export const isAdmin = requireMinRole(UserRole.ADMIN);
export const isSuperAdmin = requireRole(UserRole.SUPER_ADMIN);
export const isManager = requireMinRole(UserRole.MANAGER);
export const isStaff = requireMinRole(UserRole.STAFF);
