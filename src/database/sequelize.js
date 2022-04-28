const Sequelize = require('sequelize');
const {user, password, host, port, database} = require('../config').db;
const connection = new Sequelize.Sequelize(
  `mariadb://${user}:${password}@${host}:${port}/${database}`,
  {logging: false}
);

(async () => {
  try {
    await connection.authenticate();
    // console.log("Connected succesfully");
  } catch (err) {
    console.error("Unable to connect to the database", err);
  }
})();

module.exports = connection;