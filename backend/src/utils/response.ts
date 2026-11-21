import type { Response } from "express";


export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  res.status(statusCode).json({
    success: true,
    message: message,
    data: data
  });
}

export const errorResponse = (
  res: Response,
  statusCode: number,
  error?: any,
  message?: string,
) => {
  res.status(statusCode).json({
    success: false,
    message: error && error instanceof Error ? error.message : message,
    error: error
  });
}