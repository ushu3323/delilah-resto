const paymentMethodRepository = require("../repository/paymentMethod.repository");


function getPaymentMethods(req, res, next) {


  paymentMethodRepository.get.all()
  .then((paymentMethods) => res.status(200).json(paymentMethods))
  .catch((err) => next(err))
}

function addPaymentMethod(req, res, next) {
  const { name, description, enabled } = req.body;
  paymentMethodRepository.create({ name, description, enabled })
  .then((paymentMethod) => res.status(201).json({msg: "creado correctamente", error: false}))
  .catch((err) => next())
}

async function deletePaymentMethod(req, res) {
  req.paymentMethod.destroy()
  .then(() => res.status(200).json({msg: "El mensaje ha sido eliminado correctamente"}))
}

module.exports = {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
};