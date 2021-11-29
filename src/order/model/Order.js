const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../connection/sequelize');
const PaymentMethod = require('../../paymentMethod/model/PaymentMethod');

class Order extends Model {}

Order.init({
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { sequelize, modelName: 'order' });

PaymentMethod.hasOne(Order, { foreignKey: "paymentMethodId" });;
module.exports = Order;