import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Customer, ICustomer } from '../models/Customer.model';
import { Admin, IAdmin } from '../models/Admin.model';
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

// ── Customer Auth flows ───────────────────────────────────────────────────────

/**
 * Standard password-based login for storefront customers.
 */
export const loginCustomer = async (
  email: string,
  password: string
): Promise<{ customer: ICustomer; tokens: TokenPair }> => {
  const customer = await Customer.findOne({ email: email.toLowerCase() });
  if (!customer) {
    throw new UnauthorizedError('Invalid email or password');
  }
  if (!customer.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }
  const isMatch = await customer.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }
  
  customer.lastLoginAt = new Date();
  await customer.save();

  const tokens = signTokenPair(customer._id.toString(), 'customer');
  return { customer, tokens };
};

/**
 * Creates and registers a new storefront Customer after OTP verification.
 */
export const registerCustomer = async (
  email: string,
  name: string,
  phone: string,
  password: string
): Promise<{ customer: ICustomer; tokens: TokenPair }> => {
  const existing = await Customer.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ConflictError('Email already registered');
  }

  const customer = await Customer.create({
    email: email.toLowerCase(),
    name,
    phone,
    password,
  });

  const tokens = signTokenPair(customer._id.toString(), 'customer');
  return { customer, tokens };
};

/**
 * Resets a customer's password in the database.
 */
export const resetCustomerPassword = async (
  email: string,
  password: string
): Promise<void> => {
  const customer = await Customer.findOne({ email: email.toLowerCase() });
  if (!customer) {
    throw new NotFoundError('Customer account not found');
  }
  customer.password = password;
  await customer.save();
};

// ── Admin Auth flows ──────────────────────────────────────────────────────────

/**
 * Find admin user by email after OTP verification.
 */
export const adminLoginByEmail = async (
  email: string
): Promise<{ user: IAdmin; tokens: TokenPair }> => {
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    throw new UnauthorizedError('Authorized administrative staff only. Account not found.');
  }
  if (!admin.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const tokens = signTokenPair(admin._id.toString(), admin.role);
  return { user: admin, tokens };
};

/**
 * Super Admin: create a staff/manager account directly.
 */
export const createAdminUser = async (
  email: string,
  name: string,
  role: any
): Promise<IAdmin> => {
  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) throw new ConflictError('Email already registered as admin');

  return Admin.create({
    email: email.toLowerCase(),
    name,
    role,
    isActive: true,
  });
};

// ── Token Refresh flow ────────────────────────────────────────────────────────

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

  let user: any = await Customer.findById(payload.userId).select('isActive');
  let role = 'customer';

  if (!user) {
    user = await Admin.findById(payload.userId).select('role isActive');
    if (user) {
      role = (user as IAdmin).role;
    }
  }

  if (!user || !user.isActive) throw new NotFoundError('User not found');

  return signAccessToken(user._id.toString(), role);
};
