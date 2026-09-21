import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error(err.message, { stack: err.stack });

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    error: {
      message: statusCode === 500 && env.NODE_ENV === 'production' 
        ? 'An unexpected internal server error occurred.' 
        : err.message,
      timestamp: new Date().toISOString()
    }
  });
}