const ProductsRouter = require("express").Router();
const productController = require('../../Controllers/product.controller');

ProductsRouter.get('/view-products',productController.getAllProducts);
ProductsRouter.get('/all-products',productController.getEveryProduct);
ProductsRouter.post('/add-product',productController.addProduct);

module.exports = ProductsRouter;


