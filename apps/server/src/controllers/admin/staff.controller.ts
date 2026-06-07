import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../../utils/apiResponse';
import { NotFoundError, BadRequestError } from '../../utils/AppError';
import { Admin, AdminRole } from '../../models/Admin.model';

// GET /api/admin/staff
export const getStaff = asyncHandler(async (req: Request, res: Response) => {
  const staff = await Admin.find().sort({ createdAt: -1 });
  sendSuccess(res, staff, 'Staff registry fetched');
});

// POST /api/admin/staff (Pre-register staff)
export const registerStaff = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role) throw new BadRequestError('Name, email and role are required');

  const existingUser = await Admin.findOne({ email });
  if (existingUser) throw new BadRequestError('Staff with this email already registered');

  // Set default permissions based on role
  const permissions = {
    products: role === 'admin' || role === 'super_admin',
    orders: true,
    spinWheel: role === 'admin' || role === 'super_admin' || role === 'manager',
    staffLogs: role === 'super_admin',
  };

  const newStaff = await Admin.create({
    name,
    email,
    role,
    permissions,
  });

  sendCreated(res, newStaff, 'Staff registered successfully');
});

// PATCH /api/admin/staff/:id/permissions
export const togglePermission = asyncHandler(async (req: Request, res: Response) => {
  const { permissionKey } = req.body;
  if (!permissionKey) throw new BadRequestError('Permission key is required');

  const staff = await Admin.findById(req.params.id);
  if (!staff) throw new NotFoundError('Staff member not found');
  if (staff.role === AdminRole.SUPER_ADMIN) {
    throw new BadRequestError('Cannot modify permissions of Super Admin');
  }

  const currentVal = (staff.permissions as any)[permissionKey];
  (staff.permissions as any)[permissionKey] = !currentVal;

  await staff.save();
  sendSuccess(res, staff, 'Staff permissions updated successfully');
});

// DELETE /api/admin/staff/:id
export const deleteStaff = asyncHandler(async (req: Request, res: Response) => {
  const staff = await Admin.findById(req.params.id);
  if (!staff) throw new NotFoundError('Staff member not found');
  if (staff.role === AdminRole.SUPER_ADMIN) {
    throw new BadRequestError('Cannot delete Super Admin account');
  }

  await Admin.findByIdAndDelete(req.params.id);
  sendSuccess(res, null, 'Staff member removed successfully');
});
