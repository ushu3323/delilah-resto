const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../connection/sequelize');

class PaymentMethod extends Model {}

PaymentMethod.init({
  name: DataTypes.STRING
}, {sequelize, modelName: 'paymentMethod'});