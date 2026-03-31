import knex from 'knex';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './src/database/dev.db',
  },
  useNullAsDefault: true,
});

export default db;
