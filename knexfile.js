// Update with your config settings.

module.exports = {
  // development: {
  //   client: 'postgresql',
  //   connection: {
  //     host: process.env.DB_HOST || 'localhost',
  //     database: 'v2',
  //     user:     'Vladimir',
  //     password: '123qwe123',
  //     charset: 'utf8'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: { directory: __dirname + '/db/migrations' },
  //   seeds: { directory: __dirname + '/db/seeds' }
  // },
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: '5432',
      database: 'v2',
      user:     'postgres',
      password: 'postgres',
      charset: 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: { directory: __dirname + '/db/migrations' },
    seeds: { directory: __dirname + '/db/seeds' }
  },
  test: {
    client: 'postgresql',
    connection: {
      host: 'manny.db.elephantsql.com',
      database: 'dwfczrff',
      user:     'dwfczrff',
      password: 'odhmeYwzo8TZLiEDYoF95bVtkcXeCs62',
      charset: 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: { directory: __dirname + '/db/migrations' },
    seeds: { directory: __dirname + '/db/seeds' }
  },
  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: { directory: __dirname + '/db/migrations' },
    seeds: { directory: __dirname + '/db/seeds' }
  }
};
