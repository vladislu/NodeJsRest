
exports.up = function(knex, Promise) {
    return knex.schema
    .createTable('products', (table) => {
        table.increments();
        table.string('name');
        table.string('description');
        table.decimal('price');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updeted_at').defaultTo(knex.fn.now());
    })
    .createTable('users', (table) => {
        table.increments();
        table.string('first_name');
        table.string('last_name');
        table.string('email');
        table.string('password');
        table.string('address');
        table.string('role');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updeted_at').defaultTo(knex.fn.now());
    })
    .createTable('carts', (table) => {
        table.increments();
        table.integer('user_id').references('id').inTable('users').onDelete('cascade');;
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updeted_at').defaultTo(knex.fn.now());
    })
    .createTable('cartitems', (table) => {
        table.increments();
        table.integer('quantity');
        table.integer('cart_id').references('id').inTable('carts').onDelete('cascade');;
        table.integer('product_id').references('id').inTable('products').onDelete('cascade');;
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updeted_at').defaultTo(knex.fn.now());
    })
    .createTable('orders', (table) => {
        table.increments();
        table.decimal('total');
        table.integer('user_id').references('id').inTable('users').onDelete('cascade');;
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updeted_at').defaultTo(knex.fn.now());
    })
    .createTable('orderitems', (table) => {
        table.increments();
        table.integer('quantity');
        table.decimal('order_price');
        table.integer('order_id').references('id').inTable('orders').onDelete('cascade');;
        table.integer('product_id').references('id').inTable('products');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updeted_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
    return knex.schema
    .dropTable('orderitems')
    .dropTable('orders')
    .dropTable('cartitems')
    .dropTable('carts')
    .dropTable('users')
    .dropTable('products');
};
