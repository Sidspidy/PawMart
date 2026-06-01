import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, buildPagination } from '../../utils/apiResponse';
import { User, UserRole } from '../../models/User.model';
import { Order, OrderStatus } from '../../models/Order.model';
import { Product } from '../../models/Product.model';
import { NotFoundError } from '../../utils/AppError';

// GET /api/admin/dashboard/stats
export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalUsers,
    totalOrders,
    totalProducts,
    revenueResult,
    pendingOrders,
    lowStockCount,
  ] = await Promise.all([
    User.countDocuments({ role: UserRole.CUSTOMER }),
    Order.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments({ status: OrderStatus.PENDING }),
    Product.countDocuments({ $expr: { $lte: ['$stock', '$lowStockThreshold'] }, isActive: true }),
  ]);

  const totalRevenue = revenueResult[0]?.total ?? 0;

  sendSuccess(res, { totalUsers, totalOrders, totalProducts, totalRevenue, pendingOrders, lowStockCount }, 'Dashboard stats');
});

// GET /api/admin/dashboard/revenue?from=&to=
export const getRevenueByDate = asyncHandler(async (req: Request, res: Response) => {
  const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 86400000);
  const to = req.query.to ? new Date(req.query.to as string) : new Date();

  const revenue = await Order.aggregate([
    { $match: { createdAt: { $gte: from, $lte: to }, paymentStatus: 'paid' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  sendSuccess(res, revenue, 'Revenue data');
});

// GET /api/admin/dashboard/top-products
export const getTopProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Product.find({ isActive: true })
    .sort({ soldCount: -1 })
    .limit(10)
    .select('name slug images basePrice soldCount averageRating');
  sendSuccess(res, products, 'Top products fetched');
});

// GET /api/admin/dashboard/customers
export const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { role: UserRole.CUSTOMER };
  if (req.query.q) {
    filter.$or = [
      { name: { $regex: req.query.q, $options: 'i' } },
      { email: { $regex: req.query.q, $options: 'i' } },
    ];
  }

  const [customers, total] = await Promise.all([
    User.find(filter).select('-addresses').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  sendSuccess(res, customers, 'Customers fetched', 200, buildPagination(page, limit, total));
});

// PATCH /api/admin/dashboard/customers/:id/toggle
export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundError('User not found');
  user.isActive = !user.isActive;
  await user.save();
  sendSuccess(res, { isActive: user.isActive }, `User ${user.isActive ? 'activated' : 'deactivated'}`);
});
