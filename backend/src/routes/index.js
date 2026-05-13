import express from 'express';
import agendamentoRoutes from './agendamentoRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/agendamentos', agendamentoRoutes);
router.use('/users', userRoutes);

export default router;
