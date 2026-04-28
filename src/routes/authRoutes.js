import express from 'express';
import validate from '../middlewares/validate.js';
import * as authController from '../controllers/authController.js';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from '../models/userSchema.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  authController.login,
);
router.post('/register', validate(registerSchema), authController.register);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.get('/status', authController.getSystemStatus);

export default router;
