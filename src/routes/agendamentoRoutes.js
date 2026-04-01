import express from 'express';
import * as controller from '../controllers/agendamentoController.js';
import validate from '../middlewares/validate.js';
import {
  agendamentoSchema,
  statusSchema,
} from '../models/agendamentoSchema.js';

const router = express.Router();

router
  .route('/')
  .get(controller.getAllAgendamentos)
  .post(validate(agendamentoSchema), controller.createAgendamento);

router.patch(
  '/:id/status',
  validate(statusSchema),
  controller.updateStatusAgendamento,
);
router.delete('/:id', controller.deleteAgendamento);

export default router;
