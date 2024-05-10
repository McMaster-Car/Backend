const ProductsRouter = require("express").Router();
const productController = require('../../Controllers/productController');





ProductsRouter.get('/view-products',productController.viewProducts);
ProductsRouter.get('/view-product/:part_number',productController.viewProduct);
ProductsRouter.post('/add-product',productController.addProduct);
ProductsRouter.delete('/delete-product/:id',productController.deleteProduct);




module.exports = ProductsRouter;
