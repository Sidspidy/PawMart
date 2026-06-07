import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import app from './app';
import { seedAll } from './utils/seed';

const startServer = async (): Promise<void> => {
  // Validate env (crashes if invalid — better than silent failure)
  await connectDB();

  // Seed all required initial data (superadmin, categories, products, coupons)
  // await seedAll();

  const server = app.listen(env.PORT, () => {
    console.log(`\n🐾  PawMart API`);
    console.log(`   ├─ Port    : ${env.PORT}`);
    console.log(`   ├─ Env     : ${env.NODE_ENV}`);
    console.log(`   └─ Health  : http://localhost:${env.PORT}/api/health\n`);
  });

  // ── Graceful shutdown ───────────────────────────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n⚡  ${signal} received — shutting down gracefully…`);
    server.close(async () => {
      await Promise.allSettled([disconnectDB()]);
      console.log('✅  Graceful shutdown complete');
      process.exit(0);
    });

    // Force-kill after 10 s if still running
    setTimeout(() => {
      console.error('❌  Forced shutdown after timeout');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    console.error('💥  Unhandled Rejection:', reason);
    shutdown('unhandledRejection');
  });

  process.on('uncaughtException', (err) => {
    console.error('💥  Uncaught Exception:', err);
    shutdown('uncaughtException');
  });
};

startServer();
