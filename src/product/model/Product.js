const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../connection/sequelize');
const Order = require('../../order/model/Order');
const OrderProducts = require('../../order/model/OrderProducts');

class Product extends Model { }

Product.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, { sequelize, modelName: "product" });

Product.belongsToMany(Order, { through: OrderProducts });

/* (async () => {
    await sequelize.sync({force: false});

    await User.create({
        username:"admin",
        fullName:"ADMIN",
        email: "admin@example.com",
        phoneNumber: "123-456",
        address: "Street Address",
        password: "secretpass",
        isAdmin: true,
        enabled: true,
    })
})() */


module.exports = Product;