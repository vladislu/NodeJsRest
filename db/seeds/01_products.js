const faker = require('faker');

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      let products = [];
      for (i = 0; i < 10; i++) {
        products.push({
          name: faker.lorem.words(),
          description: faker.lorem.sentence(),
          price: faker.commerce.price()
        });
      }
      return knex('products').insert(products);
    });
};
