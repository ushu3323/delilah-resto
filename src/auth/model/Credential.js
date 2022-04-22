const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

class Credential extends Model {}

Credential.init({
  provider_userId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: false
  },
  provider_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'local'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  access_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  refresh_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {sequelize, modelName: 'credential'});

module.exports = Credential;