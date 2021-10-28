const Product = require('../model/Product');

const productTemplate = {
  name:"",
  price: 0.0,
  enabled: false
}

module.exports = {
  get:{
    byId: async (id) => {
      return await Product.findById(id);
    },
    all: async () => {
      return await Product.find();
    }
  },
  del:{
    byId: async (id) => {
      await Product.findByIdAndDelete(id);
    },
  },
  create: async (product) => {
    await Product.create(product);
  },
  update: async (id, product) => {
    await Product.findByIdAndUpdate(id, product);
  }
}