import catchAsync from '../utils/catchAsync.js';
import { resfc } from '../utils/resfc.js';
import * as agendamentoService from '../services/agendamentoService.js';

export const getAllAgendamentos = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status || null;

  const result = await agendamentoService.listarAgendamentosPaginados(
    page,
    limit,
    status,
  );

  return resfc({
    res,
    code: 200,
    data: { agendamentos: result.data, pagination: result.pagination },
    message: 'Lista de agendamentos recuperada',
    results: result.data.length,
  });
});

export const getAgendamento = catchAsync(async (req, res) => {
  const { id } = req.params;

  const agendamento = await agendamentoService.getAgendamentoPorId(id);

  return resfc({
    res,
    code: 200,
    data: agendamento,
    message: 'Agendamento recuperado com sucesso!',
  });
});

export const getDisponibilidade = catchAsync(async (req, res) => {
  const { data } = req.query;

  const horariosLivres =
    await agendamentoService.buscarHorariosDisponiveis(data);

  return resfc({
    res,
    code: 200,
    data: horariosLivres,
    message: `Horários disponíveis para ${data}`,
  });
});

export const createAgendamento = catchAsync(async (req, res, next) => {
  const novoAgendamento = await agendamentoService.criarAgendamento(req.body);

  return resfc({
    res,
    code: 201,
    data: novoAgendamento,
    message: 'Agendamento solicitado com sucesso!',
  });
});

export const updateStatusAgendamento = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const agendamentoAtualizado =
    await agendamentoService.atualizarStatusAgendamento(id, status);

  return resfc({
    res,
    code: 200,
    data: agendamentoAtualizado,
    message: `Agendamento ${status.toLowerCase()} com sucesso!`,
  });
});

export const deleteAgendamento = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await agendamentoService.excluirAgendamento(id);

  return resfc({
    res,
    code: 200,
    message: 'Agendamento removido do sistema.',
  });
});
