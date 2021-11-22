const paymentMethodRepository = require("../repository/paymentMethod.repository");

async function getPaymentMethods(req, res, next) {
  try {
    let paymentMethods = req.user.isAdmin ? await paymentMethodRepository.get.all() : await paymentMethodRepository.get.allEnabled();
    res.status(200).json(paymentMethods);
  } catch (err) {
    next(err);
  }
}

async function addPaymentMethod(req, res, next) {
  try {
    const paymentMethod = await paymentMethodRepository.create(req.payMethod);
    res.status(201).json({ msg: "creado correctamente", error: false, paymentMethod });
  } catch (err) {
    next(err);
  }
}

async function editPaymentMethod(req, res, next) {
  try {
    const { name, enabled } = req.payMethod;
    req.payMethod.set({ name, enabled });
    await req.payMethod.save();

    res.status(200)
      .json({
        msg: "Actualizado correctamente",
        error: false,
        new: { name, enabled },
      });
  } catch (err) {
    next(err);
  }
}

async function deletePaymentMethod(req, res, next) {
  try {
    await paymentMethodRepository.del.byId(req.payMethod.id);
    res.status(200).json({ msg: "El mensaje ha sido eliminado correctamente" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPaymentMethods,
  addPaymentMethod,
  editPaymentMethod,
  deletePaymentMethod,
};
