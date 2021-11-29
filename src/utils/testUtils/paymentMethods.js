const { enabled } = require('../../../main');
const paymentMethodRepository = require('../../paymentMethod/repository/paymentMethod.repository');

const placeholders = {
  creditCard: {
    name: 'Tarjeta de credito',
    enabled: false,
  },
  debitCard: {
    name: 'Tarjeta de debito',
    enabled: false,
  },
  cash: {
    name: 'Efectivo',
    enabled: false,
  },
  testMethod: {
    name: "test",
    enabled: false
  }
}

const initPlaceholders = async () => {
  for (let key in placeholders) {
    if (key == "testMethod") continue;
    // console.log("Initialized:", key)
    const payMethod = await paymentMethodRepository.create(placeholders[key]);
    placeholders[key].id = payMethod.id;
  }
}

const deletePlaceholders = async () => {
  for (let key in placeholders) {
    // console.log("Deleted:", key)
    try {
      await paymentMethodRepository.del.byId(placeholders[key].id);
    } catch (error) {
      if (key !== "testMethod") throw error;
    }
  }
}

module.exports = {
  initPlaceholders,
  deletePlaceholders,
  placeholders
}