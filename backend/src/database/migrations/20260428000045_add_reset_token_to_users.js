/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('new_email').nullable()
    table.boolean('is_verified').defaultTo(false).notNullable(); 
    table.string('verification_token', 6).nullable();
    table.string('reset_token').nullable();
    table.datetime('reset_token_expires').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumns([
      'new_email',
      'is_verified', 
      'verification_token', 
      'reset_token', 
      'reset_token_expires'
    ]);
  });
};