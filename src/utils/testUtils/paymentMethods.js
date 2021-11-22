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
}

const initPlaceholders = async () => {
  for (let key in placeholders) {
    if(key === "creditCard") continue;
    const payMethod = await paymentMethodRepository.create(placeholders[key]);
    placeholders[key].id = payMethod.id;
  }
}

const deletePlaceholders = async () => {
  for (let key in placeholders) {
    await paymentMethodRepository.del.byId(placeholders[key].id);
  }
}

module.exports = {
  initPlaceholders,
  deletePlaceholders,
  placeholders
}