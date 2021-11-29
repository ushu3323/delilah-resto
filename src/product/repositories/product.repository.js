const Product = require('../model/Product');

const productTemplate = {
  name: "",
  price: 0.0,
  enabled: false
}

module.exports = {
  get: {
    byId: async (id) => await Product.findByPk(id),
    all: async () => await Product.findAll(),
    enabled: async () => await Product.findAll({
      where: {
        enabled: true
      },
      attributes: {
        exclude: ['enabled', 'createdAt', 'updatedAt']
      }
    })
  },
  del: {
    byId: async (id) => await Product.destroy({ where: { id: id } }),
  },
  create: async (product) => await Product.create(product),
  update: async (id, product) => await Product.findByIdAndUpdate(id, product),
}