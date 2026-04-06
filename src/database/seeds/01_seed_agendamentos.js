export const seed = async function(knex) {
  await knex('agendamentos').del();

  const cursos = ['Informática para Internet', 'Administração', 'Enfermagem', 'Logística'];
  const nomes = ['Ana Silva', 'Bruno Souza', 'Carla Dias', 'Diego Lira', 'Elena Rosa'];

  const agendamentos = Array.from({ length: 15 }).map((_, i) => {
    const hora = 8 + Math.floor(i / 2);
    const minuto = i % 2 === 0 ? '00' : '30';
    
    return {
      rm: (10000 + i).toString(),
      nome: `${nomes[i % 5]} Teste ${i}`,
      email: `aluno${i}@etec.sp.gov.br`,
      curso: cursos[i % 4],
      servico_levantamento: i % 2 === 0,
      servico_normalizacao: i % 2 !== 0,
      data: '2026-05-10',
      horario: `${hora.toString().padStart(2, '0')}:${minuto}`,
      status: 'PENDENTE'
    };
  });

  await knex('agendamentos').insert(agendamentos);
};