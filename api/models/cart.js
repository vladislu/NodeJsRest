const knex = require('../../db/knex');

class Cart {
    constructor(id, user_id) {
        this.id = id;
        this.user_id = user_id;
    }

    async Create() {
        return knex('carts')
            .insert({
                user_id: this.user_id,
            });
    }

    async GetItem(prodId) {
        return knex('cartitems').where('cart_id', this.id).andWhere('product_id', prodId);
    }

    async AddNewItem(prodId) {
        return knex('cartitems')
            .insert({
                cart_id: this.id,
                product_id: prodId,
                quantity: 1
            });
    }

    async AddItem(prodId, quantity) {
        return knex('cartitems').where('cart_id', this.id).andWhere('product_id', prodId)
            .update({
                quantity: quantity
            });
    }

    async GetItems() {
        return knex('cartitems')
            .innerJoin('products', 'cartitems.product_id', '=', 'products.id')
            .where('cart_id', this.id)
            .select();
    }

    async DeleteItem(prodId) {
        return knex('cartitems').where('cart_id', this.id).andWhere('product_id', prodId).del();
    }

    async Delete() {
        return knex('carts').where('id', this.id).del();
    }

    static async GetCartByUserId(id) {
        try {
            const cart = await knex('carts').where('user_id', id);
            return new Cart(cart[0].id, cart[0].user_id);
        } catch (error) {
            return null;
        }
    }
}

module.exports = Cart;