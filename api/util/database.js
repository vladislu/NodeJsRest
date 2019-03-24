const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-rest', 'root', 'toor',{
    dialect: 'mysql',
    host: 'localhost',
    port: '3307'
});

module.exports = sequelize;