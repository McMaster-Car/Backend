const productService = require('../Services/productService');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await productService.getAllProducts();
      return res.status(200).json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  },
  getEveryProduct: async (req, res) => {
    try {
      const products = await productService.getEveryProduct();
      return res.status(200).json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  },
  

  addProduct: async (req, res) => {
    try {
      const newProduct = await productService.addProduct(req.body);
      return res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
    }
  }
};

module.exports = productController;
