import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log('📦  MongoDB: already connected');
    return;
  }

  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(env.MONGODB_URI, {
      dbName: 'pawmart',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect…');
      isConnected = false;
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌  MongoDB connection error:', err);
      isConnected = false;
    });
  } catch (error) {
    console.error('❌  MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log('🔌  MongoDB disconnected gracefully');
};
