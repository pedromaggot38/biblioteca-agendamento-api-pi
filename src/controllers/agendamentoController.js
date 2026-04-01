import catchAsync from '../utils/catchAsync.js';
import { resfc } from '../utils/response.js';
import * as agendamentoService from '../services/agendamentoService.js';

export const getAllAgendamentos = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await agendamentoService.listarAgendamentosPaginados(
    page,
    limit,
  );

  return resfc(
    res,
    200,
    { agendamentos: result.data, pagination: result.pagination },
    'Lista de agendamentos recuperada',
    result.data.length,
  );
});

export const createAgendamento = catchAsync(async (req, res, next) => {
  const novoAgendamento = await agendamentoService.criarAgendamento(req.body);

  return resfc(
    res,
    201,
    novoAgendamento,
    'Agendamento solicitado com sucesso!',
  );
});
