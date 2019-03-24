const Sequlize = require('sequelize');
const sequlize = require('../util/database');

const Cart = sequlize.define('cart', {
    id: {
        type: Sequlize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Cart;