// Update with your config settings.
const {knexSnakeCaseMappers} = require('objection');

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'test',
      user:     'postgres',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds',
    },
    ...knexSnakeCaseMappers,
  },
};
