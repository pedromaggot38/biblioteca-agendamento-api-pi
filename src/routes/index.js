import express from 'express';
import agendamentoRoutes from './agendamentoRoutes.js';

const router = express.Router();

router.use('/agendamentos', agendamentoRoutes);

export default router;
