const orderStatuses = require("../../utils/OrderStatuses");
const sequelize = require("../../database/sequelize");

const Order = require("../model/Order");
const Product = require("../../product/model/Product");
const User = require("../../user/model/User");
const PaymentMethod = require("../../paymentMethod/model/PaymentMethod");
const includeOptions = {
  product: {
    model: Product,
    attributes: { exclude: ["enabled", "createdAt", "updatedAt"] },
    through: { attributes: ["amount"] }
  },
  user: { model: User, as: "user", attributes: { exclude: ["password"] }},
  paymentMethod: { model: PaymentMethod, attributes: {exclude: ["createdAt", "updatedAt", "enabled"] }},
  get all() {
    return [this.product, this.user, this.paymentMethod]
  }
}
const attrOptions = { exclude: ["checkout_id", "total"] }

module.exports = {
  get: {
    all: async () => {
      const orders = await Order.findAll({
        attributes: attrOptions,
        include: includeOptions.all
      });
      return orders;
    },
    byStatus: async (status) => {
      const orders = await Order.findAll({
        where: { status },
        attributes: attrOptions,
        include: includeOptions.all
      });
      return await orders;
    },
    byId: async (id, raw = true) => {
      const order = await Order.findOne({
        where: { id },
        attributes: attrOptions,
        include: includeOptions.all
      });
      if (order) return (raw ? order.toJSON() : order);
    },
    byUserId: async (userId) => {
      let orders = await Order.findAll({
        where: { userId },
        attributes: attrOptions,
        include: [includeOptions.product, includeOptions.paymentMethod]
      });
      console.log(orders);
      return orders;
    },
    byCheckoutId: async (checkoutId) => {
      let order = await Order.findOne({
        where: {
          checkout_id: checkoutId
        },
        // attributes: attrOptions,
        include: includeOptions.all
      });
      return order;
    }
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
      await order.update({ paymentMethodId: orderBody.paymentMethodId });
      await order.save();
    });
    return result;
  }
};
