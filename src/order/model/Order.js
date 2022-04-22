const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');


function addProductAmount(orderInstance) {
  // Add `amount` field on each product
  if (!orderInstance.products) return
  orderInstance.products.forEach(product => {
    if(!product.order_products?.amount) return;
    product.dataValues.amount = product.order_products.amount;
    delete product.dataValues.order_products;
  });
}

function afterFindHandler(instanceOrInstances) {
  console.log("Order hook: afterFind");
  if(!instanceOrInstances) return
  if(Array.isArray(instanceOrInstances)) {
    if (instanceOrInstances.length === 0) return
    console.log("Order hook: findAll");
    const instances = instanceOrInstances;
    instances.forEach(addProductAmount);
  } else {
    console.log("Order hook: findOne")
    const instance = instanceOrInstances;
    addProductAmount(instance);
  }
}


class Order extends Model {}

Order.init({
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total: {
    type: DataTypes.VIRTUAL,
    get() {
      try {
        console.log("On Get order.total")
        const productPrices = this.products.map((product) => product.price * product.order_products.amount);
        const total = productPrices.reduce((accum, value) => accum + value, 0);
        return total;
      } catch (err) {
        console.error(err);
        console.log(`WARNING: returning total null of order #${this.id}`)
        return null;
      }
    }
  },
  checkout_id: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'order',
  hooks: {
    afterFind: afterFindHandler,
  }
});


module.exports = Order;

const PaymentMethod = require('../../paymentMethod/model/PaymentMethod');
const OrderProducts = require('./OrderProducts'); // Initialize association table
Order.belongsTo(PaymentMethod);
