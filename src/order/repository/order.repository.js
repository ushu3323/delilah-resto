const Order = require('../model/Order');

module.exports = {
  get: {
    all: async () => await Order.findAll({}),
    byStatus: async (status) => await Order.findAll({ where: { status } }),
    byId: async (id) => await Order.findOne({ where: { id } }),
    byUserId: async (userId) => await Order.findAll({ where: { userId } }),
  },
  del: {
    byId: async (id) => await Order.destroy({ where: { id } }),
  },
  create: async (order) => await Order.create(order),
  }