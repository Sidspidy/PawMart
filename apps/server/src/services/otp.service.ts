import crypto from 'crypto';
import { getRedis } from '../config/redis';
import { env } from '../config/env';

const OTP_PREFIX = 'otp:';
const ATTEMPTS_PREFIX = 'otp_attempts:';
const MAX_ATTEMPTS = 5;

/**
 * Generates a numeric OTP, stores it in Redis with TTL.
 * Returns the OTP (to be emailed — never sent in API response).
 */
export const generateOtp = async (email: string): Promise<string> => {
  const redis = getRedis();
  const otp = crypto.randomInt(10 ** (env.OTP_LENGTH - 1), 10 ** env.OTP_LENGTH).toString();
  const key = `${OTP_PREFIX}${email.toLowerCase()}`;

  await redis.set(key, otp, 'EX', env.OTP_TTL_SECONDS);
  // Reset attempt counter on new OTP generation
  await redis.del(`${ATTEMPTS_PREFIX}${email.toLowerCase()}`);

  return otp;
};

/**
 * Verifies the OTP. Increments attempt counter.
 * Deletes OTP on successful verification (one-time use).
 */
export const verifyOtp = async (
  email: string,
  otp: string
): Promise<{ valid: boolean; reason?: string }> => {
  const redis = getRedis();
  const normalizedEmail = email.toLowerCase();
  const otpKey = `${OTP_PREFIX}${normalizedEmail}`;
  const attemptsKey = `${ATTEMPTS_PREFIX}${normalizedEmail}`;

  // Check attempt count
  const attempts = parseInt((await redis.get(attemptsKey)) ?? '0', 10);
  if (attempts >= MAX_ATTEMPTS) {
    return { valid: false, reason: 'Too many failed attempts. Request a new OTP.' };
  }

  const storedOtp = await redis.get(otpKey);

  if (!storedOtp) {
    return { valid: false, reason: 'OTP expired or not found. Request a new one.' };
  }

  if (storedOtp !== otp.trim()) {
    await redis.incr(attemptsKey);
    await redis.expire(attemptsKey, env.OTP_TTL_SECONDS);
    return { valid: false, reason: 'Incorrect OTP.' };
  }

  // Valid — clean up
  await redis.del(otpKey);
  await redis.del(attemptsKey);
  return { valid: true };
};

/** Check if an OTP is currently pending for an email (rate-limit guard). */
export const hasActiveotp = async (email: string): Promise<boolean> => {
  const redis = getRedis();
  const ttl = await redis.ttl(`${OTP_PREFIX}${email.toLowerCase()}`);
  return ttl > 0;
};

/** Remaining TTL (seconds) for an OTP — useful for frontend countdown. */
export const otpTtl = async (email: string): Promise<number> => {
  const redis = getRedis();
  return redis.ttl(`${OTP_PREFIX}${email.toLowerCase()}`);
};
