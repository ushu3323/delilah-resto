const { Products, Users } = require('../../models/Data');
const productRepository = require('../repositories/product.repository');

function setProductEnabled(req,res) {
    const productId = parseInt(req.params.productId);
    const product = Products.get(productId);
 
    if (product.enabled === req.body.enabled){
        res.status(200).json({msg:`El producto ya estaba dado de ${product.enabled ? 'alta' : 'baja'}`})
    } else {
        product.enabled = req.body.enabled
        res.status(200).json({msg:`Se ha dado de ${product.enabled ? 'alta' : 'baja'} el producto`})
    }
}

function addNewProduct(req, res) {
    const { name, price } = req.body;
    Products.add(name, price);
    res.sendStatus(201);
}

function editProduct(req, res) {
    const { name, price } = req.body;
    const productId = parseInt(req.params.productId);
    const product = Products.get(productId);
    product.name = name;
    product.price = price; 
    
    res.status(200).json({msg: "Producto modificado correctamente"});
}

function deleteProduct(req, res) {
    const productId = parseInt(req.params.productId);
    const index = Products.list.findIndex(p => p.id === productId);
    const deleted = Products.list.splice(index, 1);

    res.status(200).json({msg: "Se ha eliminado correctamente", product: deleted});
}

async function getProducts(req, res){
    // Lists the products and send depending of the role of the user that sent the request
    // Check if the user is admin and if so, sends all the products
    let products;

    if (req.user.isAdmin) {
        products = await productRepository.get.all();
    } else {
        // Otherwise, it just sends a list of enabled products
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