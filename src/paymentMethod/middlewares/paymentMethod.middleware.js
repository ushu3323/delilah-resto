const paymentMethodRepository = require("../repository/paymentMethod.repository");

async function paymentExist(req, res, next) {
  const { id: _id } = req.params;
  const id = parseInt(_id);

  if (isNaN(id))
    return res.status(422).json({ message: "Id invalida", error: true });

  try {
    const paymentMethod = await paymentMethodRepository.get.byId(id);
    if (!paymentMethod)
      return res
        .status(404)
        .json({ message: "Metodo de pago no encontrado", error: true });

    req.params.id = id;
    req.payMethod = paymentMethod;

    next();
  } catch (error) {
    next(err);
  }
}

async function validateNewPaymentMethod(req, res, next) {
  const { name, enabled } = req.body;

  if (typeof name !== "string" || typeof enabled !== "boolean")
    return res.status(422).json({ message: "Campos invalidos", error: true });

  req.payMethod = { name, enabled };
  next();
}

async function validateEditPaymentMethod(req, res, next) {
  let { name, enabled } = req.body;

  if (
    (name && typeof name !== "string") ||
    (enabled && typeof enabled !== "boolean")
  )
    return res.status(422).json({ message: "Campos invalidos", error: true });

  try {
    // console.log("old:", req.payMethod.name, req.payMethod.enabled);

    name ??= req.payMethod.name;
    enabled ??= req.payMethod.enabled;

    req.payMethod.set({ name, enabled });
    // console.log("new:", req.payMethod.name, req.payMethod.enabled);

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateNewPaymentMethod,
  validateEditPaymentMethod,
  paymentExist,
};
