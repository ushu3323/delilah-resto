const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');
const PaymentMethod = require('../../paymentMethod/model/PaymentMethod');

class Order extends Model {}

Order.init({
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { sequelize, modelName: 'order' });

module.exports = Order;

const PaymentMethod = require('../../paymentMethod/model/PaymentMethod');
const OrderProducts = require('./OrderProducts'); // Initialize association table
Order.belongsTo(PaymentMethod);
