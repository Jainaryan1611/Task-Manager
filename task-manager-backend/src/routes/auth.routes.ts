import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, refresh, logout, me } from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be 3–30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.post('/refresh', refresh);

router.post('/logout', logout);

router.get('/me', authenticate, me);

export default router;
