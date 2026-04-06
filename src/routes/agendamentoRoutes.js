import express from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import {
  agendamentoSchema,
  statusSchema,
} from '../models/agendamentoSchema.js';
import { createAgendamento, deleteAgendamento, getAllAgendamentos, updateStatusAgendamento } from '../controllers/agendamentoController.js';

const router = express.Router();

router
  .route('/')
  .get(auth, getAllAgendamentos)
  .post(validate(agendamentoSchema), createAgendamento);

router
  .route('/:id/')
  .patch(auth, validate(statusSchema), updateStatusAgendamento)
  .delete(auth, deleteAgendamento);
export default router;
