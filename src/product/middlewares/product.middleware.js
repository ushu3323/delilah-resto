const productRepository = require('../repositories/product.repository');


function validateBody(req, res, next) {
    const { name, price, category, enabled } = req.body;
    if (
      typeof name === "string" && name.length &&
      typeof category === "string" && category.length &&
      typeof price === "number" && typeof enabled === "boolean") {

      req.newProduct = { name, price, category, enabled };
      next();
    } else {
      res.status(422).json({ msg: "Los campos son invalidos", error: true });
    }
}

function idValidation(req, res, next) {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res
        .status(422)
        .json({ msg: "La id del producto es invalida", error: true });
    }
    req.productId = productId;
    next();
}

async function productExists(req, res, next) {
  try {
    req.product = await productRepository.get.byId(req.productId);
    if (!req.product) {
      return res.status(404).json({
        error: `No se ha encontrado un producto con id ${req.productId}`,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
}


function validateProductEnabled (req, res, next) {
    const { enabled } = req.body;
    if (!(typeof enabled === "boolean")) {
        res.status(422).json({msg: "Los campos son invalidos", error: true});
        return;
    }
    next();
}

module.exports = {
    idValidation,
    validateBody,
    validateProductEnabled,
    idProductExists: [idValidation, productExists],
}