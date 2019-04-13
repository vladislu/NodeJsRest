
const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');

const Sequelize = require('sequelize');

const knex = require('../../db/knex');


exports.addProduct = async (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    try {
        const product = new Product(name, description, price);
        await product.Create();
        res.status(201).json({ message: 'Product created' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        await Product.Delete(req.params.prodId);
        res.status(202).json({ message: 'Product deleted.' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.updateProduct = async (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product();
    try {
        await product.LoadById(req.params.prodId);
    } catch (error) {
        return res.status(500).json({ error: 'Product not found.' });
    }

    product.name = name;
    product.description = description;
    product.price = price;

    try {
        await product.Save();
        res.status(200).json({ message: 'Product updeted.' });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

exports.topProducts = async (req, res, next) => {
    const month = req.params.month;

    let to = new Date();
    to.setMonth(month);
    to.setHours(1, 59, 59, 999);
    to.setDate(1);

    let from = new Date();
    from.setMonth(month - 1);
    from.setHours(2, 0, 0, 0);
    from.setDate(1);

    try {
        const result = await knex('products').whereIn('id',
            await knex('orderitems')
                .whereBetween('created_at', [from, to])
                .groupBy('product_id')
                .select('product_id')
                .limit(5)
                .orderByRaw('count(quantity) desc')
                .map(x => { return x.product_id }));
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.topCustomers = async (req, res, next) => {
    const month = req.params.month;

    let to = new Date();
    to.setMonth(month);
    to.setHours(1, 59, 59, 999);
    to.setDate(1);

    let from = new Date();
    from.setMonth(month - 1);
    from.setHours(2, 0, 0, 0);
    from.setDate(1);

    // try {
        const result = await knex('orders')
        .innerJoin('users', 'user_id', '=', 'users.id')
        .whereBetween('orders.created_at', [from, to])
        .groupBy('user_id','first_name', 'last_name')
        .limit(5)
        .orderByRaw('count(*) desc')
        .select('user_id','first_name', 'last_name');
        res.status(200).json(result);
    // } catch (error) {
    //     res.status(500).json(error);
    // }
}

exports.topCustomersTotal = async (req, res, next) => {
    const month = req.params.month;

    let to = new Date();
    to.setMonth(month);
    to.setHours(1, 59, 59, 999);
    to.setDate(1);

    let from = new Date();
    from.setMonth(month - 1);
    from.setHours(2, 0, 0, 0);
    from.setDate(1);

    try {
        const result = await knex('orders')
        .innerJoin('users', 'user_id', '=', 'users.id')
        .whereBetween('orders.created_at', [from, to])
        .groupBy('user_id', 'first_name','last_name')
        .limit(5)
        .select('user_id','first_name', 'last_name' )
        .sum('total')
        .orderBy('sum', 'desc')
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.avgSales = async (req, res, next) => {
    const month = req.params.month;
    let to = new Date();
    to.setMonth(month);
    to.setHours(1, 59, 59, 999);
    to.setDate(1);

    let from = new Date();
    from.setMonth(month - 1);
    from.setHours(2, 0, 0, 0);
    from.setDate(1);
    try {
        const result = await knex('orders').avg('total').whereBetween('created_at', [from, to]);
        res.status(200).json({ avg: (+result[0].avg).toFixed(2) });
    } catch (error) {
        res.status(500).json(error);

    }
}
