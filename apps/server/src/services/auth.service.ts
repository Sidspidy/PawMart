import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, IUser, UserRole, AuthProvider } from '../models/User.model';
import { ConflictError, NotFoundError, UnauthorizedError } from '../utils/AppError';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ── Token helpers ─────────────────────────────────────────────────────────────
export const signAccessToken = (userId: string, role: string): string =>
  jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });

export const signRefreshToken = (userId: string): string =>
  jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] });

export const signTokenPair = (userId: string, role: string): TokenPair => ({
  accessToken: signAccessToken(userId, role),
  refreshToken: signRefreshToken(userId),
});

// ── Auth flows ────────────────────────────────────────────────────────────────

/**
 * Find-or-create user by email after OTP verification.
 * New users are created with CUSTOMER role and email verified.
 */
export const loginOrRegisterByEmail = async (
  email: string
): Promise<{ user: IUser; tokens: TokenPair; isNew: boolean }> => {
  let isNew = false;
  let user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    user = await User.create({
      email: email.toLowerCase(),
      name: email.split('@')[0], // placeholder name
      role: UserRole.CUSTOMER,
      provider: AuthProvider.EMAIL,
      isEmailVerified: true,
    });
    isNew = true;
  } else {
    user.isEmailVerified = true;
    user.lastLoginAt = new Date();
    await user.save();
  }

  const tokens = signTokenPair(user._id.toString(), user.role);
  return { user, tokens, isNew };
};

/**
 * Refresh access token using a valid refresh token.
 */
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  let payload: { userId: string };
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const user = await User.findById(payload.userId).select('role isActive');
  if (!user || !user.isActive) throw new NotFoundError('User not found');

  return signAccessToken(user._id.toString(), user.role);
};

/**
 * Admin: create a staff/manager account directly (no OTP).
 */
export const createAdminUser = async (
  email: string,
  name: string,
  role: UserRole
): Promise<IUser> => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ConflictError('Email already registered');

  return User.create({
    email: email.toLowerCase(),
    name,
    role,
    provider: AuthProvider.EMAIL,
    isEmailVerified: true,
  });
};
