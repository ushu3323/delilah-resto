const paymentMethodRepository = require('../repository/paymentMethod.repository');

async function paymentExist(req, res, next) {
  const { paymentMethodId:id } = req.params;
  id = parseInt(id, 10);

  if (isNaN(id)) return res.status(422).json({msg:"Id invalida", error: true});

  const paymentMethod = await paymentMethodRepository.get.byId(id);

  if (!paymentMethod)
  return res.status(404).json({msg:"Metodo de pago no encontrado", error: true});
  
  req.payMethod = paymentMethod;
  next();
}

async function validateNewPaymentMethod(req, res, next) {
  const {name, enabled} = req.body;

  if (typeof name !== 'string' || typeof enabled !== 'boolean')
    return res.status(422).json({msg:"Campos invalidos", error: true});
  
  req.payMethod = {name, enabled};
  next();
}


module.exports = {
  paymentExist
}