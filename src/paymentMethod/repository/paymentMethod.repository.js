const PaymentMethod = require("../model/PaymentMethod");

module.exports = {
  get: {
    byId: async (id) => {
      const paymentMethod = await PaymentMethod.findByPk(id);
      return paymentMethod;
    },
    all: async () => {
      const paymentMethods = await PaymentMethod.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      return paymentMethods;
    },
    allEnabled: async () => {
      const paymentMethods = await PaymentMethod.findAll({
        where: { enabled: true },
        attributes: {
          exclude: ["createdAt", "updatedAt", "enabled"],
        },
      });
      return paymentMethods;
    },
  },
  del: {
    byId: async (id) => {
      await PaymentMethod.destroy({ where: { id: id } });
    },
  },
  create: async (paymentMethod) => {
    return await PaymentMethod.create(paymentMethod);
  },
};
