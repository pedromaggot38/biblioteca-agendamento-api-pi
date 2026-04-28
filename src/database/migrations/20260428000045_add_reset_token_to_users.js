/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.boolean('is_active').defaultTo(false);
    table.string('activation_token');
    table.string('reset_token');
    table.datetime('reset_token_expires');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumns([
      'is_active', 
      'activation_token', 
      'reset_token', 
      'reset_token_expires'
    ]);
  });
};