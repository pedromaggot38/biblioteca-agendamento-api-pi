import AppError from '../appError.js';

export const validarHorarioAgendamento = (horarioStr) => {
  const [hora, minuto] = horarioStr.split(':').map(Number);
  const totalMinutos = hora * 60 + minuto;
  const inicioExpediente = 8 * 60;
  const fimExpediente = 16 * 60;

  const foraDoHorario =
    totalMinutos < inicioExpediente || totalMinutos > fimExpediente;
  const intervaloInvalido = minuto !== 0 && minuto !== 30;

  if (foraDoHorario || intervaloInvalido) {
    throw new AppError(
      'Horário inválido. Agendamentos das 08:00 às 16:00 (intervalos de 30min).',
      400
    );
  }
};

export const validarDataFutura = (dataAgendamento) => {
  const hoje = getTodayBR();

  if (dataAgendamento < hoje) {
    throw new AppError(
      'Não é possível realizar agendamentos para datas passadas.',
      400
    );
  }
};

export const validarDisponibilidadeHorario = async (db, data, horario) => {
  const conflito = await db('agendamentos').where({ data, horario }).first();

  if (conflito) {
    throw new AppError('Este horário já está reservado para outro aluno.', 409);
  }
};

export const validarVinculoExistente = (
  existente,
  dadosEnvio,
  emailNormalizado,
) => {
  if (
    existente &&
    (existente.rm !== dadosEnvio.rm || existente.email !== emailNormalizado)
  ) {
    throw new AppError(
      'Dados de RM/E-mail não coincidem com registros anteriores.',
      400
    );
  }
};

/**
 * Retorna a data e hora atual formatada para o fuso de São Paulo
 * no padrão aceito pelo SQLite (ISO 8601 adaptado).
 */
export const getNowBR = () => {
  return (
    new Date()
      .toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' })
      .replace(' ', 'T') + '.000Z'
  );
};

export const getTodayBR = () => {
  return new Date()
    .toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' })
    .split(' ')[0];
};
