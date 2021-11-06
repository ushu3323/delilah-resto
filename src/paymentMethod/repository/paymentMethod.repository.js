const PaymentMethod = require('../model/PaymentMethod');


module.exports = {
  get: {
    byId: async (id) => {
      const paymentMethod = PaymentMethod.findByPk(id);
      return paymentMethod;
    },
    all: async () => {
      const paymentMethods = PaymentMethod.findAll();
      return paymentMethods;
    }
  },
  del: {
    byId: async (id) => {
      const paymentMethod = await PaymentMethod.destroy({where: {id: id}});
      return paymentMethod;
    }
  },
  create: async (paymentMethod) => {
    await PaymentMethod.create(paymentMethod);
  }
}