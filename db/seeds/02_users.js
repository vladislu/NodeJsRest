
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      // password 1234
      return knex('users').insert([
        {
          first_name: 'system',
          last_name: 'admin',
          email: 'admin@test.com',
          password: '$2b$10$OMRqfupiyLqxnGPIghYWauHdlNNh0M3EhwOoerD5juP/8LuxAdUr.',
          address: 'israel',
          role: 'admin'
        },
        {
          first_name: 'user',
          last_name: 'user',
          email: 'user@test.com',
          password: '$2b$10$OMRqfupiyLqxnGPIghYWauHdlNNh0M3EhwOoerD5juP/8LuxAdUr.',
          address: 'israel',
          role: 'client'
        }
      ]);
    });
};
