import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if ((err as any).code === 'P2002') {
    const field = (err as any).meta?.target?.[0] || 'field';
    res.status(409).json({ error: `A user with that ${field} already exists` });
    return;
  }

  if ((err as any).code === 'P2025') {
    res.status(404).json({ error: 'Resource not found' });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
}
