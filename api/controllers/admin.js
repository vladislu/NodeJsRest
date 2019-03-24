
const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');

const Sequelize = require('sequelize');

exports.addProduct = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    Product.create({
        name: name,
        price: price,
        description: description
    })
        .then(result => {
            res.status(201).json({ message: 'Product created' });
        })
        .catch(err => res.status(500).json({ error: err }));
}

exports.deleteProduct = (req, res, next) => {
    Product.findByPk(req.params.prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            res.status(202).json({ message: 'Product deleted.' });
        })
        .catch(err => { res.status(500).json({ error: err }) });
}

exports.updateProduct = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    Product.findByPk(req.params.prodId)
        .then(product => {
            if (product) {
                product.name = name;
                product.price = price;
                product.description = description;
                product.save();
            } else {
                return res.status(404).json({ message: 'Product not found.' });
            }
        })
        .then(result => {
            res.status(202).json({ message: 'Product updeted.' });
        })
        .catch(err => { res.status(500).json({ error: err }) });
}

exports.topProducts = (req, res, next) => {
    const month = req.params.month;
    const Op = Sequelize.Op;

    let to = new Date();
    to.setMonth(month);
    to.setHours(1, 59, 59, 999);
    to.setDate(1);

    let from = new Date();
    from.setMonth(month - 1);
    from.setHours(2, 0, 0, 0);
    from.setDate(1);

    Order.findAll({
        include: [{ model: Product }],
        where: { createdAt: { [Op.gt]: from, [Op.lt]: to } }
    })
        .then(orders => {
            let products = [];
            orders.forEach(order => {
                order.products.forEach(product => {
                    const index = products.findIndex(obj => obj.id === product.id);
                    if (index != -1) {
                        products[index].quantity = products[index].quantity + product.orderItem.quantity;
                    } else {
                        products.push({
                            id: +product.id,
                            name: product.name,
                            description: product.description,
                            price: +product.price,
                            quantity: +product.orderItem.quantity
                        });
                    }
                });
            });
            return Promise.resolve(products);
        })
        .then(products => {
            const result = products.sort((a, b) => b.quantity - a.quantity).slice(0, 5);
            res.status(200).json(result);
        })
        .catch(err => { res.status(500).json({ error: err.message }) });
}

exports.topCustomers = (req, res, next) => {
    const month = req.params.month;
    const Op = Sequelize.Op;

    let to = new Date();
    to.setMonth(month);
    to.setHours(1, 59, 59, 999);
    to.setDate(1);

    let from = new Date();
    from.setMonth(month - 1);
    from.setHours(2, 0, 0, 0);
    from.setDate(1);

    Order.findAll({
        include: [{ model: User }],
        where: { createdAt: { [Op.gt]: from, [Op.lt]: to } }
    })
        .then(orders => {
            let customers = [];
            orders.forEach(order => {
                const index = customers.findIndex(obj => obj.id === order.userId);
                if (index != -1) {
                    customers[index].quantity = customers[index].quantity + 1;
                    customers[index].total = customers[index].total + +order.total;
                    customers[index].total = +customers[index].total.toFixed(2);
                } else {
                    customers.push({
                        id: +order.userId,
                        name: order.user.first_name + ' ' + order.user.last_name,
                        total: +order.total,
                        quantity: 1
                    });
                }
            });
            return Promise.resolve(customers);
        })
        .then(customers => {
            const result = customers.sort((a, b) => b.quantity - a.quantity).slice(0, 5);
            res.status(200).json(result);
        })
        .catch(err => { res.status(500).json({ error: err.message }) });
}

exports.topCustomersTotal = (req, res, next) => {
    const month = req.params.month;
    const Op = Sequelize.Op;

    let to = new Date();
    to.setMonth(month);
    to.setHours(1, 59, 59, 999);
    to.setDate(1);

    let from = new Date();
    from.setMonth(month - 1);
    from.setHours(2, 0, 0, 0);
    from.setDate(1);

    Order.findAll({
        include: [{ model: User }],
        where: { createdAt: { [Op.gt]: from, [Op.lt]: to } }
    })
        .then(orders => {
            let customers = [];
            orders.forEach(order => {
                const index = customers.findIndex(obj => obj.id === order.userId);
                if (index != -1) {
                    customers[index].quantity = customers[index].quantity + 1;
                    customers[index].total = customers[index].total + +order.total;
                    customers[index].total = +customers[index].total.toFixed(2);
                } else {
                    customers.push({
                        id: +order.userId,
                        name: order.user.first_name + ' ' + order.user.last_name,
                        total: +order.total,
                        quantity: 1
                    });
                }
            });
            return Promise.resolve(customers);
        })
        .then(customers => {
            const result = customers.sort((a, b) => b.total - a.total).slice(0, 5);
            res.status(200).json(result);
        })
        .catch(err => { res.status(500).json({ error: err.message }) });
}

exports.avgSales = (req, res, next) => {
    const month = req.params.month;
    const Op = Sequelize.Op;

    let to = new Date();
    to.setMonth(month);
    to.setHours(1, 59, 59, 999);
    to.setDate(1);

    let from = new Date();
    from.setMonth(month - 1);
    from.setHours(2, 0, 0, 0);
    from.setDate(1);

    Order.findAll({
        include: [{ model: Product }],
        where: { createdAt: { [Op.gt]: from, [Op.lt]: to } }
    })
        .then(orders => {
            let products = [];
            orders.forEach(order => {
                order.products.forEach(product => {
                    const index = products.findIndex(obj => obj.id === product.id);
                    if (index != -1) {
                        products[index].quantity = products[index].quantity + product.orderItem.quantity;
                    } else {
                        products.push({
                            id: +product.id,
                            name: product.name,
                            description: product.description,
                            price: +product.price,
                            quantity: +product.orderItem.quantity
                        });
                    }
                });
            });
            return Promise.resolve(products);
        })
        .then(products => {
            let result = {total: 0, quantity: 0, avg: 0 };
            products.forEach(product => {
                result.total = result.total + (product.price * product.quantity);
                result.total = +result.total.toFixed(2);
                result.quantity = result.quantity + product.quantity;
            });
            result.avg = result.total * result.quantity / 100;
            result.avg = +result.avg.toFixed(2);
            res.status(200).json(result);
        })
        .catch(err => { res.status(500).json({ error: err.message }) });
}