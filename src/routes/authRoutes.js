import express from 'express';
import protect from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import * as authController from '../controllers/authController.js';
import { loginSchema, registerSchema } from '../models/authSchema.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  authController.login,
);
router.post('/register', validate(registerSchema), authController.register);

router.get('/status', authController.getSystemStatus);
router.get('/me', protect, authController.me);

export default router;
