import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../../utils/apiResponse';
import { NotFoundError, BadRequestError } from '../../utils/AppError';
import { Address } from '../../models/Address.model';
import { z } from 'zod';

const addressSchema = z.object({
  label: z.enum(['Home', 'Work', 'Other']).default('Home'),
  fullName: z.string().min(2, 'Name too short'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  line1: z.string().min(3, 'Address line too short'),
  line2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City too short'),
  state: z.string().min(2, 'State too short'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  isDefault: z.boolean().default(false),
});

// GET /api/addresses
export const getAddresses = asyncHandler(async (req: Request, res: Response) => {
  const list = await Address.find({ user: req.user!._id }).sort({ isDefault: -1, createdAt: -1 });
  sendSuccess(res, list, 'Addresses fetched successfully');
});

// POST /api/addresses
export const createAddress = asyncHandler(async (req: Request, res: Response) => {
  const data = addressSchema.parse(req.body);
  const userId = req.user!._id;

  if (data.isDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
  } else {
    // If this is the user's first address, set it to default anyway!
    const count = await Address.countDocuments({ user: userId });
    if (count === 0) {
      data.isDefault = true;
    }
  }

  const created = await Address.create({
    user: userId,
    ...data,
  });

  sendCreated(res, created, 'Address created successfully');
});

// PUT /api/addresses/:id
export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const data = addressSchema.parse(req.body);
  const addressId = req.params.id;
  const userId = req.user!._id;

  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) throw new NotFoundError('Address not found');

  if (data.isDefault && !address.isDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
  }

  Object.assign(address, data);
  await address.save();

  sendSuccess(res, address, 'Address updated successfully');
});

// DELETE /api/addresses/:id
export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const addressId = req.params.id;
  const userId = req.user!._id;

  const deleted = await Address.findOneAndDelete({ _id: addressId, user: userId });
  if (!deleted) throw new NotFoundError('Address not found');

  // If deleted address was default, make another one default
  if (deleted.isDefault) {
    const another = await Address.findOne({ user: userId });
    if (another) {
      another.isDefault = true;
      await another.save();
    }
  }

  sendSuccess(res, null, 'Address deleted successfully');
});

// PATCH /api/addresses/:id/default
export const setDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
  const addressId = req.params.id;
  const userId = req.user!._id;

  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) throw new NotFoundError('Address not found');

  await Address.updateMany({ user: userId }, { isDefault: false });
  address.isDefault = true;
  await address.save();

  sendSuccess(res, address, 'Default address set successfully');
});
