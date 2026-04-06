import express from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { getSystemStatus, login, me, register } from '../controllers/authController.js';
import { loginSchema, registerSchema } from '../models/authSchema.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);

router.get('/status', getSystemStatus);
router.get('/me', auth, me);

export default router;