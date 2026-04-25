import express from 'express';
import auth from '../middlewares/auth.js';
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

router.get(
  '/disponibilidade',
  apiLimiter,
  validate(disponibilidadeSchema, 'query'),
  agendamentoController.getDisponibilidade,
);

router
  .route('/')
  .get(auth, agendamentoController.getAllAgendamentos)
  .post(
    createAgendamentoLimiter,
    validate(agendamentoSchema),
    agendamentoController.createAgendamento,
  );

router
  .route('/:id/')
  .get(auth, agendamentoController.getAgendamento)
  .patch(
    auth,
    validate(statusSchema),
    agendamentoController.updateStatusAgendamento,
  )
  .delete(auth, agendamentoController.deleteAgendamento);

export default router;
