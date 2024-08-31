const ProductsRouter = require("express").Router();
const productController = require('../../Controllers/product.controller');


ProductsRouter.get('/view-products',productController.getAllProducts);
ProductsRouter.get('/all-products',productController.getEveryProduct);
ProductsRouter.get('/getProduct-withVariation/:id/:isParentID',productController.getProductWithVariations);
ProductsRouter.post('/add-product',productController.addProduct);
ProductsRouter.put('/editProductData/:id',productController.editProductData);
ProductsRouter.put('/editVariationData/:id',productController.editVariationData);
ProductsRouter.delete('/delete-product/:id',productController.deleteOneProduct);



module.exports = ProductsRouter;


