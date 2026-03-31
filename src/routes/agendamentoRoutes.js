import express from 'express';
import {
  createAgendamento,
  getAllAgendamentos,
} from '../controllers/agendamentoController.js';
import validate from '../middlewares/validate.js';
import { agendamentoSchema } from '../models/agendamentoSchema.js';

const router = express.Router();

router
  .route('/')
  .get(getAllAgendamentos)
  .post(validate(agendamentoSchema), createAgendamento);

export default router;
