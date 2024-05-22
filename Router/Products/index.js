const ProductsRouter = require("express").Router();
const productController = require('../../Controllers/product.controller');

ProductsRouter.get('/view-products',productController.getAllProducts);
ProductsRouter.post('/add-product',productController.addProduct);

module.exports = ProductsRouter;


