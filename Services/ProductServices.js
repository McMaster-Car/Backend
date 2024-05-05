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
  
  
};

module.exports = productService;
