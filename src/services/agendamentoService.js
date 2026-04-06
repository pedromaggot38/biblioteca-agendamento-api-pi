import db from '../config/db.js';
import {
  getNowBR,
  getTodayBR,
  validarDataFutura,
  validarDisponibilidadeHorario,
  validarHorarioAgendamento,
  validarVinculoExistente,
} from '../utils/controllers/agendamentoUtils.js';

import { formatTitleCase } from '../utils/stringUtils.js';

export const listarAgendamentosPaginados = async (
  page,
  limit,
  status = null,
) => {
  const offset = (page - 1) * limit;

  let query = db('agendamentos');
  let countQuery = db('agendamentos');

  if (status) {
    query = query.where({ status });
    countQuery = countQuery.where({ status });
  }

  const agendamentos = await query
    .select('*')
    .limit(limit)
    .offset(offset)
    .orderBy('id', 'desc');

  const [{ total }] = await countQuery.count('id as total');

  return {
    data: agendamentos,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const criarAgendamento = async (dados) => {
  const email = dados.email.trim().toLowerCase();
  const nome = formatTitleCase(dados.nome);
  const curso = formatTitleCase(dados.curso);
  const agora = getNowBR();

  validarHorarioAgendamento(dados.horario);
  validarDataFutura(dados.data);

  await validarDisponibilidadeHorario(db, dados.data, dados.horario);

  const existente = await db('agendamentos')
    .where({ rm: dados.rm })
    .orWhere({ email })
    .first();

  validarVinculoExistente(existente, dados, email);

  const { servico_levantamento, servico_normalizacao, ...resto } = dados;

  const [id] = await db('agendamentos').insert({
    ...resto,
    nome,
    email,
    curso,
    servico_levantamento: servico_levantamento ? 1 : 0,
    servico_normalizacao: servico_normalizacao ? 1 : 0,
    status: 'PENDENTE',
    created_at: agora,
    updated_at: agora,
  });

  return {
    id,
    ...dados,
    nome,
    email,
    curso,
    status: 'PENDENTE',
    created_at: agora,
  };
};

export const atualizarStatusAgendamento = async (id, status) => {
  const agora = getNowBR();

  const agendamento = await db('agendamentos').where({ id }).update({
    status,
    updated_at: agora,
  });

  if (!agendamento) {
    const error = new Error('Agendamento não encontrado para atualização.');
    error.statusCode = 404;
    throw error;
  }

  return { id, status };
};

export const excluirAgendamento = async (id) => {
  const agendamento = await db('agendamentos').where({ id }).delete();

  if (!agendamento) {
    const error = new Error('Agendamento não encontrado para exclusão.');
    error.statusCode = 404;
    throw error;
  }

  return true;
};

export const buscarHorariosDisponiveis = async (data) => {
  if (data < getTodayBR()) return [];

  const todosHorarios = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
    '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  const ocupados = await db('agendamentos')
    .where({ data })
    .whereNot('status', 'RECUSADO')
    .pluck('horario');

  return todosHorarios.filter(horario => !ocupados.includes(horario));
};
