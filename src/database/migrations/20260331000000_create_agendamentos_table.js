/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('agendamentos', (table) => {
    table.increments('id').primary();
    table.string('rm', 5).notNullable();
    table.string('email').notNullable();
    table.string('curso').notNullable();
    table.boolean('servico_levantamento').defaultTo(false);
    table.boolean('servico_normalizacao').defaultTo(false);
    table.string('data_atendimento').notNullable();
    table.string('hora_atendimento').notNullable();
    table.string('status').defaultTo('PENDENTE');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('agendamentos');
};
