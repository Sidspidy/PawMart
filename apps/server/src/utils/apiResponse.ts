import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  pagination?: Pagination
): Response => {
  const response: ApiResponse<T> = { success: true, message, data };
  if (pagination) response.pagination = pagination;
  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(res: Response, data: T, message = 'Created successfully'): Response =>
  sendSuccess(res, data, message, 201);

export const sendError = (
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errors?: unknown
): Response => {
  const response: ApiResponse = { success: false, message, errors };
  return res.status(statusCode).json(response);
};

export const buildPagination = (
  page: number,
  limit: number,
  total: number
): Pagination => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};
