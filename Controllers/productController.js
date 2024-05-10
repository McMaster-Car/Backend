const prodctServices = require('../Services/ProductServices');

const productController = {

  viewProducts: async (req, res) => {
    try {
      const products = await prodctServices.getProducts();

      return res.status(200).json({ success: true,total_Products: products.length ,  products });
    } catch (error) {
      return res.status(500).json({ success: false,message: 'Internal Server Error', error: error.message });
    }
  },
  viewProduct: async (req, res) => {
    try {
      const product = await prodctServices.getProduct(req.params.part_number);

      return res.status(200).json({ success: true, product });
    } catch (error) {
      return res.status(500).json({ success: false,message: 'Internal Server Error', error: error.message });
    }
  },
  addProduct: async (req, res) => {
    try {
      
      const newProduct = await prodctServices.addProduct(req.body);

      return res.status(201).json({ success: true, message: 'Product added successfully', product: newProduct });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const deletedProduct = await prodctServices.deleteProduct(productId);
      return res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  }
 
  
};

module.exports = productController;
