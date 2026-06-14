import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// ── Restructured Route imports (Storefront Web & Admin Dashboard) ────────────
import webAuthRoutes from './routes/web/auth.routes';
import webProductRoutes from './routes/web/product.routes';
import webCategoryRoutes from './routes/web/category.routes';
import webCartRoutes from './routes/web/cart.routes';
import webOrderRoutes from './routes/web/order.routes';
import webPaymentRoutes from './routes/web/payment.routes';
import webCouponRoutes from './routes/web/coupon.routes';
import webPointsRoutes from './routes/web/points.routes';
import webAddressRoutes from './routes/web/address.routes';
import webSettingRoutes from './routes/web/setting.routes';

import adminDashboardRoutes from './routes/admin/dashboard.routes';
import adminProductRoutes from './routes/admin/product.routes';
import adminCategoryRoutes from './routes/admin/category.routes';
import adminOrderRoutes from './routes/admin/order.routes';
import adminCouponRoutes from './routes/admin/coupon.routes';
import adminSpinRoutes from './routes/admin/spin.routes';
import adminStaffRoutes from './routes/admin/staff.routes';
import adminUploadRoutes from './routes/admin/upload.routes';

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

// ── Global rate limiter (Production only) ───────────────────────────────────────
if (env.NODE_ENV === 'production') {
  const globalLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please slow down.' },
  });
  app.use(globalLimiter);
}

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

// ── API Routes (Storefront Customer APIs) ────────────────────────────────────
app.use('/api/auth', webAuthRoutes);
app.use('/api/products', webProductRoutes);
app.use('/api/categories', webCategoryRoutes);
app.use('/api/cart', webCartRoutes);
app.use('/api/orders', webOrderRoutes);
app.use('/api/payment', webPaymentRoutes);
app.use('/api/coupons', webCouponRoutes);
app.use('/api/points', webPointsRoutes);
app.use('/api/addresses', webAddressRoutes);
app.use('/api/settings', webSettingRoutes);

// ── API Routes (Admin Dashboard Management APIs) ─────────────────────────────
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/coupons', adminCouponRoutes);
app.use('/api/admin/spin', adminSpinRoutes);
app.use('/api/admin/staff', adminStaffRoutes);
app.use('/api/admin/upload', adminUploadRoutes);

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
