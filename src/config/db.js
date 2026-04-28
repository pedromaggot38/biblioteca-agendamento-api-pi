import 'dotenv/config';
import knex from 'knex';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: process.env.DATABASE_FILENAME || './src/database/dev.db',
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    },
    min: 1,
    max: 1,
  },
});

export default db;