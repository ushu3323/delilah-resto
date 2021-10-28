const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../connection/sequelize');

class Order extends Model {}

Order.init({
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { sequelize, modelName: 'order' });

module.exports = Order;