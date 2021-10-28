const sequelize = require('../../connection/sequelize');

const OrderProducts = sequelize.define('OrderProducts', {
  amount: {
    type: sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = OrderProducts;