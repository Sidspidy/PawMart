import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { NotFoundError, BadRequestError } from '../utils/AppError';
import { Cart } from '../models/Cart.model';
import { Product } from '../models/Product.model';

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await Cart.findOne({ user: req.user!._id }).populate('items.product', 'name images basePrice stock isActive');
  sendSuccess(res, cart ?? { items: [], subtotal: 0 }, 'Cart fetched');
});

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId, variant, sku, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new NotFoundError('Product not found');
  if (product.stock < quantity) throw new BadRequestError('Insufficient stock');

  let cart = await Cart.findOne({ user: req.user!._id });
  if (!cart) cart = new Cart({ user: req.user!._id, items: [] });

  const existingIndex = cart.items.findIndex(
    (i) => i.product.toString() === productId && i.variant === variant
  );

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, variant, sku: sku ?? product.sku, quantity, price: product.basePrice });
  }

  await cart.save();
  sendSuccess(res, cart, 'Cart updated');
});

export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { sku, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user!._id });
  if (!cart) throw new NotFoundError('Cart not found');

  const item = cart.items.find((i) => i.sku === sku);
  if (!item) throw new NotFoundError('Item not in cart');

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.sku !== sku);
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  sendSuccess(res, cart, 'Cart updated');
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  await Cart.findOneAndUpdate({ user: req.user!._id }, { items: [], subtotal: 0 });
  sendSuccess(res, null, 'Cart cleared');
});
