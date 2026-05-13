export default {
  development: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_FILENAME || './src/database/dev.db',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    },
  },
};