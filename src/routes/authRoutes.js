import express from 'express';
import { getSystemStatus, login, register } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/status', getSystemStatus);

export default router;