const knex = require('../../db/knex');

class Order {
    constructor(id, total, user_id) {
        this.id = id;
        this.total = total;
        this.user_id = user_id;
    }

    async Create(cartitems) {
        const order = await knex('orders').insert({
            user_id: this.user_id,
        }).returning('id');
        this.id = order[0];

        let total = 0;
        const orderitems = cartitems.map(item => {
            total = total + (item.price * item.quantity);
            total = +total.toFixed(2);
            const orderitem = {
                order_id: this.id,
                product_id: item.id,
                order_price: item.price,
                quantity: item.quantity
            }
            return orderitem;
        });
        this.total = total;

        const insertDb = await knex('orderitems').insert(orderitems);
        const updateDb = await knex('orders').where('id', this.id).update({ total: this.total });
        return updateDb;
    }

    static async GetOrdersByUserId(userId) {
        try {
            const orders = await knex('orders')
            .innerJoin('orderitems', 'orders.id' , '=', 'orderitems.order_id')
            .innerJoin('products', 'orderitems.product_id' , '=', 'products.id')
            .where('user_id', userId);

            let userOrders = [];
            orders.forEach(item => {
                let flag = true;
                userOrders.forEach(order => {
                    if(order.order_id === item.order_id) {
                        order.items.push(item);
                        flag = false;
                        return;
                    }
                });
                if(flag){
                    userOrders.push({order_id: item.order_id, total: item.total, user_id: item.user_id, items: [item]})
                }
            });
            return userOrders;
        } catch (error) {
            return null;
        }
    }

    static async GetOrderByIdAndUserId(userId, orderId){
        try {
            const order = await knex('orders')
            .innerJoin('orderitems', 'orders.id' , '=', 'orderitems.order_id')
            .innerJoin('products', 'orderitems.product_id' , '=', 'products.id')
            .where('user_id', userId).andWhere('order_id', orderId);
            return order;
        } catch (error) {
            return null;
        }
    }

}

module.exports = Order;