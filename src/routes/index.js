import express from 'express';
import agendamentoRoutes from './agendamentoRoutes.js';
import authRoutes from './authRoutes.js'

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/agendamentos', agendamentoRoutes);

export default router;
