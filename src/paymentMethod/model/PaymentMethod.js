const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');


class PaymentMethod extends Model {}

PaymentMethod.init({
  name: DataTypes.STRING,
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {sequelize, modelName: 'payment_method'});

module.exports = PaymentMethod;

const Order = require('../../order/model/Order');
PaymentMethod.hasMany(Order);