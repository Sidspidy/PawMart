import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// ── Route imports ─────────────────────────────────────────────────────────────
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import couponRoutes from './routes/coupon.routes';
import pointsRoutes from './routes/points.routes';
import adminRoutes from './routes/admin.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.set('trust proxy', 1);

app.use(
  cors({
    origin: [env.CLIENT_ORIGIN, env.ADMIN_ORIGIN],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

// ── Global rate limiter ───────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});
app.use(globalLimiter);

// ── Body parsing ──────────────────────────────────────────────────────────────
// Raw body for Razorpay webhook signature verification
app.use(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  (req, _res, next) => {
    if (Buffer.isBuffer(req.body)) {
      (req as any).rawBody = req.body;
      req.body = JSON.parse(req.body.toString());
    }
    next();
  }
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// ── Logging ───────────────────────────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: '🐾 PawMart API is running', env: env.NODE_ENV });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
