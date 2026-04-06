import express from 'express';
import auth from '../middlewares/auth.js';
import { getSystemStatus, login, me, register } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/status', getSystemStatus);

router.get('/me', auth, me);

export default router;