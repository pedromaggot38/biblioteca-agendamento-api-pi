export default {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/dev.db',
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