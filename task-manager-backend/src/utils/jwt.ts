// src/utils/jwt.ts
import jwt, { SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  const secret = process.env.JWT_ACCESS_SECRET!;
  const options: SignOptions = {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn']) || '15m',
  };
  return jwt.sign(payload, secret, options);
}

export function generateRefreshToken(payload: TokenPayload): string {
  const secret = process.env.JWT_REFRESH_SECRET!;
  const options: SignOptions = {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn']) || '7d',
  };
  return jwt.sign(payload, secret, options);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
}

export function getRefreshTokenExpiry(): Date {
  const days = 7;
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}
