import 'dotenv/config';
import knex from 'knex';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: process.env.DATABASE_FILENAME || './src/database/dev.db',
  },
  useNullAsDefault: true,
});

export default db;
