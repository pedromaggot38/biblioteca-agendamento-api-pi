import express from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import {
  agendamentoSchema,
  disponibilidadeSchema,
  statusSchema,
} from '../models/agendamentoSchema.js';
import { createAgendamento, deleteAgendamento, getAllAgendamentos, getDisponibilidade, updateStatusAgendamento } from '../controllers/agendamentoController.js';

const router = express.Router();

router.get('/disponibilidade', validate(disponibilidadeSchema, 'query'), getDisponibilidade);

router
  .route('/')
  .get(auth, getAllAgendamentos)
  .post(validate(agendamentoSchema), createAgendamento);

router
  .route('/:id/')
  .patch(auth, validate(statusSchema), updateStatusAgendamento)
  .delete(auth, deleteAgendamento);
export default router;
