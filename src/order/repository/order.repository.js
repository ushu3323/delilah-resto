const orderStatuses = require("../../utils/OrderStatuses");
const sequelize = require("../../database/sequelize");

const Order = require("../model/Order");
const Product = require("../../product/model/Product");
const OrderProducts = require("../model/OrderProducts");
const User = require("../../user/model/User");
const paymentMethodRepository = require("../../paymentMethod/repository/paymentMethod.repository");


async function parseOrder(order) {
  let o = { ...order.toJSON() };
  o.products.map((product) => {
    product.amount = product.info.amount;
    delete product.info;
    return product;
  });

  return o;
}

const includeOptions = [
  {
    model: Product,
    attributes: { exclude: ["enabled", "createdAt", "updatedAt"] },
    through: { attributes: ["amount"], as: "info" }
  },
  { model: User, as: "user", attributes: { exclude: ["password", "isAdmin", "enabled"] } },
  { model: PaymentMethod, attributes: { exclude: ["createdAt", "updatedAt", "enabled"] } }
]

module.exports = {
  get: {
    all: async () => {
      const orders = await Order.findAll({
        attributes: { exclude: ["userId"] },
        include: includeOptions
      });
      return (await Promise.all(orders.map(async (o) => await parseOrder(o))));
    },
    byStatus: async (status) => {
      const orders = await Order.findAll({ where: { status }, include: Product });
      return await Promise.all(orders.map(async (o) => await parseOrder(o)));
    },
    byId: async (id, raw = true) => {
      const order = await Order.findOne({
        where: { id },
        include: includeOptions
      });
      return raw ? parseOrder(order) : order;
    },
    byUserId: async (userId) => {
      let orders = await Order.findAll({ where: { userId }, include: includeOptions[0] });
      return await Promise.all(orders.map(async (o) => await parseOrder(o)));
    },
  },
  del: {
    byId: async (id) => await Order.destroy({ where: { id } }),
  },
  create: async (
    orderBody = { products: [{ id: 0, amount: 0 }], paymentMethodId: 0 },
    userinstance,
    status = orderStatuses.NUEVO
  ) => {
    const result = await sequelize.transaction(async (t) => {
      const orderInstance = await userinstance.createOrder({
        status,
        paymentMethodId: orderBody.paymentMethodId,
      });

      for (p of orderBody.products) {
        await orderInstance.addProduct(p.id, { through: { amount: p.amount } });
      }
      await orderInstance.save();
    });

    return result;
  },
  edit: async (order, orderBody = { products: [{ id: 0, amount: 0 }], paymentMethodId: 0 }) => {
    const result = sequelize.transaction(async (t) => {
      await order.setProducts([]);
      for (p of orderBody.products) {
        await order.addProduct(p.id, { through: { amount: p.amount } });
      }
      order.paymentMethodId = orderBody.paymentMethodId;
      await order.save();
    });
    return result;
  }
};
