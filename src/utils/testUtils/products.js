const productRepository = require('../../product/repositories/product.repository');

const placeholders = [
  {
    name: 'Testproduct1',
    price: 100,
    category: 'test',
    enabled: true
  },
  {
    name: 'Testproduct2',
    price: 200,
    category: 'test',
    enabled: false
  },
];

async function initProducts() {
  for await (let product of placeholders){
    const {id} = await productRepository.create(product);
    product.id = id;
  }
}

async function deleteProducts() {
  for await (let product of placeholders) {
    await productRepository.del.byId(product.id)
  }
}

async function getLastProductId() {
  const products = await productRepository.get.all()
  return products[products.length - 1]?.id || 0;
}

module.exports = {
  placeholders,
  getLastProductId,
  initProducts,
  deleteProducts
};