/**
 * One-time cleanup script: deletes all orders and resets the order counter.
 * Run once with: npx ts-node src/scripts/clearOrders.ts
 */
import mongoose from 'mongoose';
import { env } from '../config/env';

async function run() {
  await mongoose.connect(env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const orderResult = await mongoose.connection.collection('orders').deleteMany({});
  console.log(`🗑️  Deleted ${orderResult.deletedCount} orders`);

  const counterResult = await mongoose.connection.collection('counters').deleteMany({});
  console.log(`🔄 Reset ${counterResult.deletedCount} counter(s)`);

  await mongoose.disconnect();
  console.log('✅ Done. Order counter will start fresh at PAW-0001.');
}

run().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
