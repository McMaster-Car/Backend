// product.service.js
const Product = require('../Model/Products');
const Attribute = require('../Model/Attributes');
const Variation = require('../Model/Variations')
const Category  = require('../Model/Category')





const productService = {
  getAllProducts: async () => {
    try {
      const products = await Product.find()
        .populate({
          path: 'attributes.attributeId',
          model: 'Attribute'
        })
        .populate('categories')
        .populate('variations')
        .exec();
  
      return products.map(product => {
        const attributes = product.attributes.map(attr => {
          const attribute = attr.attributeId;
          return {
            attributeId: attribute._id,
            attributeName: attribute.name, // Assuming your Attribute model has a name field
            values: attr.values
          };
        });
  
        return {
          ...product.toObject(),
          attributes
        };
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
  
 
 getEveryProduct : async () => {
    try {
      const products = await Product.find()
        .populate({
          path: 'attributes.attributeId',
          model: 'Attribute'
        })
        .populate('categories')
        .populate('variations')
        .limit(500)
        .exec();
  
      const expandedProducts = [];
  
      products.forEach(product => {
        product.variations.forEach(variation => {
          const productAttributes = product.attributes.map(attr => {
            return {
              attributeId: attr.attributeId._id,
              attributeName: attr.attributeId.name, // Assuming your Attribute model has a name field
              values: attr.values
            };
          });
  
          const variationAttributes = variation.attributes.map(varAttr => {
            const attribute = productAttributes.find(attr => attr.attributeId.equals(varAttr.attributeId));
            return {
              attributeId: varAttr.attributeId,
              attributeName: attribute ? attribute.attributeName : '',
              value: varAttr.value
            };
          });
  
          expandedProducts.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            categories: product.categories,
            variation: {
              _id: variation._id,
              attributes: variationAttributes,
              retailPrice: variation.retailPrice,
              salePrice: variation.salePrice,
              stockQuantity: variation.stockQuantity,
              isStockAvailable: variation.isStockAvailable,
              picture: variation.picture,
              weight: variation.weight,
              dimensions: variation.dimensions,
              others : variation.others
            }
          });
        });
      });
  
      return expandedProducts;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  addProduct: async (productData) => {
    try {
     

      const variationIds = [];
      for (const variationData of productData.variations) {
        const variation = new Variation(variationData);
        await variation.save();
        variationIds.push(variation._id);
      }

      delete productData.variations;

      const product = new Product({ ...productData, variations: variationIds });
      return await product.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
};


module.exports = productService;
