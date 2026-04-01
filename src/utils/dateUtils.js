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
