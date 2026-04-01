import db from '../config/db.js';

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
  const [id] = await db('agendamentos').insert({
    rm: dados.rm,
    email: dados.email,
    curso: dados.curso,
    servico_levantamento: dados.servicoLevantamento ? 1 : 0,
    servico_normalizacao: dados.servicoNormalizacao ? 1 : 0,
    data_atendimento: dados.dataAtendimento,
    hora_atendimento: dados.horaAtendimento,
    status: 'PENDENTE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return { id, ...dados, status: 'PENDENTE' };
};
