const { Model, DataTypes} = require('sequelize');
const sequelize = require('../../connection/sequelize');

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
    password: {
        type: DataTypes.STRING,
        allowNull: false,
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


module.exports = User;