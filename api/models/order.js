const Sequlize = require('sequelize');
const sequlize = require('../util/database');

const Order = sequlize.define('order', {
    id: {
        type: Sequlize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    total: {
        type: Sequlize.DOUBLE,
        allowNull: false
    }
});

module.exports = Order;