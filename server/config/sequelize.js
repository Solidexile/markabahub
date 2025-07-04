const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('markabahub_db', 'root', '0192837465hassan', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize; 