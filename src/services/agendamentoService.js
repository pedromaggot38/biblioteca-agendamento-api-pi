import db from '../config/db.js';

import { getNowBR } from '../utils/dateUtils.js';

export const listarAgendamentosPaginados = async (page, limit) => {
  const offset = (page - 1) * limit;

  const agendamentos = await db('agendamentos')
    .select('*')
    .limit(limit)
    .offset(offset)
    .orderBy('created_at', 'desc');

  const [{ total }] = await db('agendamentos').count('id as total');

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
  const nome = dados.nome.trim().toUpperCase();
  const agora = getNowBR();

  const existente = await db('agendamentos')
    .where({ rm: dados.rm }).orWhere({ email }).first();

  if (existente && (existente.rm !== dados.rm || existente.email !== email)) {
    const error = new Error("Dados de RM/E-mail não coincidem com registros anteriores.");
    error.statusCode = 400;
    throw error;
  }

  const { servico_levantamento, servico_normalizacao, ...resto } = dados;

  const [id] = await db('agendamentos').insert({
    ...resto,
    nome,
    email,
    servico_levantamento: servico_levantamento ? 1 : 0,
    servico_normalizacao: servico_normalizacao ? 1 : 0,
    status: 'PENDENTE',
    created_at: agora,
    updated_at: agora,
  });

  return { id, ...dados, nome, email, status: 'PENDENTE', created_at: agora };
};

export const atualizarStatusAgendamento = async (id, status) => {
  const horaAtual = getHoraAtual();

  const rowsAffected = await db('agendamentos').where({ id }).update({
    status,
    updated_at: horaAtual,
  });

  if (!rowsAffected) {
    const error = new Error('Agendamento não encontrado para atualização.');
    error.statusCode = 404;
    throw error;
  }

  return { id, status };
};

export const excluirAgendamento = async (id) => {
  const rowsAffected = await db('agendamentos').where({ id }).delete();

  if (!rowsAffected) {
    const error = new Error('Agendamento não encontrado para exclusão.');
    error.statusCode = 404;
    throw error;
  }

  return true;
};
