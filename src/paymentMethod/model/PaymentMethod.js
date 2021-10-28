const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../connection/sequelize');
const Order = require('../../order/model/Order');


class PaymentMethod extends Model {}

PaymentMethod.init({
  name: DataTypes.STRING
}, {sequelize, modelName: 'paymentMethod'});

PaymentMethod.hasOne(Order);

module.exports = PaymentMethod;