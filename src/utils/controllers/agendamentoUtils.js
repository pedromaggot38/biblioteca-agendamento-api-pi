export const validarHorarioAgendamento = (horarioStr) => {
  const [hora, minuto] = horarioStr.split(':').map(Number);
  const totalMinutos = hora * 60 + minuto;
  const inicioExpediente = 8 * 60;
  const fimExpediente = 16 * 60;

  const foraDoHorario =
    totalMinutos < inicioExpediente || totalMinutos > fimExpediente;
  const intervaloInvalido = minuto !== 0 && minuto !== 30;

  if (foraDoHorario || intervaloInvalido) {
    const error = new Error(
      'Horário inválido. Agendamentos das 08:00 às 16:00 (intervalos de 30min).',
    );
    error.statusCode = 400;
    throw error;
  }
};

export const validarDisponibilidadeHorario = async (db, data, horario) => {
  const conflito = await db('agendamentos').where({ data, horario }).first();

  if (conflito) {
    const error = new Error('Este horário já está reservado para outro aluno.');
    error.statusCode = 409;
    throw error;
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
    const error = new Error(
      'Dados de RM/E-mail não coincidem com registros anteriores.',
    );
    error.statusCode = 400;
    throw error;
  }
};
