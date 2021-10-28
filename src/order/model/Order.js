const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../connection/sequelize');

const Product = require('../../product/model/Product');
const OrderProducts = require('./OrderProducts');

class Order extends Model {}

// Initialize Order
Order.init({
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    }
  },
  payment_id: {
    type: DataTypes.INTEGER,
    
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { sequelize, modelName: 'order' });

Order.belongsToMany(Product, { through: OrderProducts });

module.exports = Order;