import catchAsync from '../utils/catchAsync.js';
import { enviarEmail } from '../utils/mailer.js';
import { resfc } from '../utils/resfc.js';
import * as agendamentoService from '../services/agendamentoService.js';

export const getAllAgendamentos = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status || null;
  const search = req.query.search || null

  const result = await agendamentoService.listarAgendamentosPaginados(
    page,
    limit,
    status,
    search
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

  const agendamento = await agendamentoService.atualizarStatusAgendamento(id, status);

  let emailEnviado = false;

  if (status === 'APROVADO' || status === 'RECUSADO') {
    const tipo = status === 'APROVADO' ? 'APROVACAO_AGENDAMENTO' : 'RECUSA_AGENDAMENTO';
    
    try {
      await enviarEmail(agendamento.email, tipo, {
        nome: agendamento.nome,
        data: agendamento.data.split('-').reverse().join('/'),
        horario: agendamento.horario
      });
      emailEnviado = true;
    } catch (err) {
      console.error("Falha ao tentar notificar o aluno:", err);
      emailEnviado = false;
    }
  }

  const mensagemAmigavel = emailEnviado 
    ? `Agendamento ${status.toLowerCase()} e aluno notificado!`
    : `Agendamento ${status.toLowerCase()}, mas o e-mail de notificação falhou.`;

  return resfc({
    res,
    code: 200,
    data: agendamento,
    message: mensagemAmigavel,
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
