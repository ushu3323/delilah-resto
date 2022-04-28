const { Model, DataTypes} = require('sequelize');
const sequelize = require('../../database/sequelize');
const Order = require('../../order/model/Order');
const Credential = require('../../auth/model/Credential');

class User extends Model {}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {sequelize, modelName: "user"});

User.Order = User.hasMany(Order);
Order.belongsTo(User, {as: 'user', foreignKey: 'userId'});
User.hasMany(Credential);

module.exports = User;