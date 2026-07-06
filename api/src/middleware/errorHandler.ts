import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
  statusCode?: number;
}

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  
  const status = err.status || err.statusCode || 500;
  
  // Mask detailed messages in production for 500 / internal errors (e.g. database errors)
  const isProduction = process.env.NODE_ENV === 'production';
  let message = err.message || 'Internal Server Error';
  
  if (isProduction && status === 500) {
    message = 'Internal Server Error';
  }

  res.status(status).json({
    success: false,
    error: message,
  });
}
