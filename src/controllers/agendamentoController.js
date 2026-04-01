import db from '../config/db.js';

export const createAgendamento = async (req, res, next) => {
  try {
    const [id] = await db('agendamentos').insert({
      rm: req.body.rm,
      email: req.body.email,
      curso: req.body.curso,
      servico_levantamento: req.body.servicoLevantamento ? 1 : 0,
      servico_normalizacao: req.body.servicoNormalizacao ? 1 : 0,
      data_atendimento: req.body.dataAtendimento,
      hora_atendimento: req.body.horaAtendimento,
      status: 'PENDENTE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    res.status(201).json({
      id,
      mensagem: 'Agendamento solicitado com sucesso!',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAgendamentos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const agendamentos = await db('agendamentos')
      .select('*')
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');

    const [{ total }] = await db('agendamentos').count('id as total');

    res.json({
      data: agendamentos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
