const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const Order = require('../../order/model/Order');
const Product = require('../../product/model/Product');

class OrderProducts extends Model {}


OrderProducts.init({
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {sequelize, modelName: 'order_products'});

Order.belongsToMany(Product, { through: OrderProducts });
Product.belongsToMany(Order, { through: OrderProducts });

module.exports = OrderProducts;