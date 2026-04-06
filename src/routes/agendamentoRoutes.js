import express from 'express';
import validate from '../middlewares/validate.js';
import {
  agendamentoSchema,
  statusSchema,
} from '../models/agendamentoSchema.js';
import { createAgendamento, deleteAgendamento, getAllAgendamentos, updateStatusAgendamento } from '../controllers/agendamentoController.js';

const router = express.Router();

router
  .route('/')
  .get(getAllAgendamentos)
  .post(validate(agendamentoSchema), createAgendamento);

router.patch('/:id/status', validate(statusSchema), updateStatusAgendamento);
router.delete('/:id', deleteAgendamento);

export default router;
