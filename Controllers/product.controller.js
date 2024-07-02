const dataService = require('../Services/JSON/DataService');
const productService = require('../Services/productService');
const fs = require('fs');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await productService.getAllProducts();
      return res.status(200).json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  },
  uploadBulkProducts: async (req, res) => {
    try {
      const filePath = req.file.path;
      const mimeType = req.file.mimetype;

      const data = await dataService.DataUpload(filePath, mimeType);

      res.status(200).json({
        success: true,
        message: 'Products uploaded successfully',
        data: data
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    } finally {
      fs.unlinkSync(req.file.path); // Remove the uploaded file
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
