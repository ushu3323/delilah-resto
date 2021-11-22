const users = require("./users");
const products = require("./products");
const orders = require("./orders");
const paymentMethods = require("./paymentMethods");


const bulkInit = async (utils) => {
  for (util of utils) {
    await util.initPlaceholders()
  }
} 

const bulkDelete = async (utils) => {
  for (let util of utils) {
    await util.deletePlaceholders()
  }
}

module.exports = {
  bulkInit,
  bulkDelete,
  users,
  products,
  orders,
  paymentMethods
}