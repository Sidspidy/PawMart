import Redis from 'ioredis';
import { env } from './env';

let redisClient: Redis | null = null;

export const getRedis = (): Redis => {
  if (redisClient) return redisClient;

  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    enableReadyCheck: true,
  });

  redisClient.on('connect', () => console.log('✅  Redis connected'));
  redisClient.on('error', (err) => console.error('❌  Redis error:', err));
  redisClient.on('close', () => console.warn('⚠️  Redis connection closed'));

  return redisClient;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('🔌  Redis disconnected gracefully');
  }
};
