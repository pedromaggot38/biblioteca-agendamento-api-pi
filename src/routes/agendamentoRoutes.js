import express from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import {
  agendamentoSchema,
  disponibilidadeSchema,
  statusSchema,
} from '../models/agendamentoSchema.js';
import { createAgendamento, deleteAgendamento, getAllAgendamentos, getDisponibilidade, updateStatusAgendamento } from '../controllers/agendamentoController.js';
import { apiLimiter, createAgendamentoLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.get('/disponibilidade', apiLimiter, validate(disponibilidadeSchema, 'query'), getDisponibilidade);

router
  .route('/')
  .get(auth, getAllAgendamentos)
  .post(createAgendamentoLimiter, validate(agendamentoSchema), createAgendamento);

router
  .route('/:id/')
  .patch(auth, validate(statusSchema), updateStatusAgendamento)
  .delete(auth, deleteAgendamento);
export default router;
