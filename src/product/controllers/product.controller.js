const productRepository = require("../repositories/product.repository");

async function setProductEnabled(req, res) {
  if (req.product.enabled === req.body.enabled) {
    res.status(200).json({ message: `El producto ya estaba dado de ${product.enabled ? 'alta' : 'baja'}` })
  } else {
    req.product.enabled = req.body.enabled;
    req.product.save();
    res.status(200).json({ message: `Se ha dado de ${req.product.enabled ? 'alta' : 'baja'} el producto` })
  }
}

async function addNewProduct(req, res) {
  try {
    await productRepository.create(req.newProduct);
    res.status(201).json({ message: "Producto creado correctamente", error: false });
  } catch (error) {
    next(error);
  }
}

async function editProduct(req, res, next) {
  const { name, price, category, enabled } = req.body;

  try {
    req.product.set({ name, price, category, enabled })
    await req.product.save();
    res.status(200).json({ message: "Producto modificado correctamente", error: false });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await req.product.destroy();
    res.status(200).json({ message: "Se ha eliminado correctamente", product: req.product, error: false });
  } catch (error) {
    next(error);
  }
}

async function getProducts(req, res) {
  // Lists the productRepository and send depending of the role of the user that sent the request
  let products;
  // Check if the user is admin and if so, sends all registered products
  if (req.user.isAdmin) {
    products = await productRepository.get.all();
  } else {
    // Otherwise, it just sends only products enabled
    products = await productRepository.get.enabled();
  }
  res.status(200).json(products)
}

module.exports = {
  setProductEnabled,
  setProductEnabled,
  addNewProduct,
  editProduct,
  deleteProduct,
  getProducts,
}