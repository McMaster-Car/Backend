const ProductsRouter = require("express").Router();
const productController = require('../../Controllers/product.controller');
const multer = require('multer');


const upload = multer({ dest: 'uploads/' });

ProductsRouter.get('/view-products',productController.getAllProducts);
ProductsRouter.get('/all-products',productController.getEveryProduct);
ProductsRouter.post('/add-product',productController.addProduct);
ProductsRouter.post('/upload', upload.single('file'), productController.uploadBulkProducts);


module.exports = ProductsRouter;


