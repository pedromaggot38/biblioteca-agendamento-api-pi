import express from 'express';
import protect from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import {
  agendamentoSchema,
  disponibilidadeSchema,
  statusSchema,
} from '../models/agendamentoSchema.js';
import * as agendamentoController from '../controllers/agendamentoController.js';
import {
  apiLimiter,
  createAgendamentoLimiter,
} from '../middlewares/rateLimiter.js';

const router = express.Router();

router
  .route('/')
  .get(protect, agendamentoController.getAllAgendamentos)
  .post(
    createAgendamentoLimiter,
    validate(agendamentoSchema),
    agendamentoController.createAgendamento,
  );

router
  .route('/:id/')
  .get(protect, agendamentoController.getAgendamento)
  .patch(
    protect,
    validate(statusSchema),
    agendamentoController.updateStatusAgendamento,
  )
  .delete(protect, agendamentoController.deleteAgendamento);

router.get(
  '/disponibilidade',
  apiLimiter,
  validate(disponibilidadeSchema, 'query'),
  agendamentoController.getDisponibilidade,
);
export default router;
