// services/movieService.js
const BoltAndScrewsModel = require('../Model/BoltAndScrews');

const productService = {
  
  getProducts: async () => {
    try {
      
      const products = await BoltAndScrewsModel.find();

      if (!products) {
        throw new Error('Movie not found');
      }


      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getProduct: async (bickle_part_number) => {
    try {
      
      const products = await BoltAndScrewsModel.find({'Bickle Part Numbers' : bickle_part_number});

      if (!products) {
        throw new Error('Movie not found');
      }


      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  addProduct: async (productData) => {
    try {
      const newProduct = new BoltAndScrewsModel(productData);
      
      await newProduct.save();
      
      return newProduct;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  deleteProduct: async (productId) => {
    try {
      const deletedProduct = await BoltAndScrewsModel.findByIdAndDelete(productId);
      if (!deletedProduct) {
        throw new Error('Product not found');
      }
      return deletedProduct;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  
};

module.exports = productService;
