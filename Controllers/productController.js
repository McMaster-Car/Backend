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
  
};

module.exports = productController;
