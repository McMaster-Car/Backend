// product.service.js
const Product = require('../Model/Products');
const Attribute = require('../Model/Attributes');

const productService = {
  getAllProducts: async () => {
    try {
      const products = await Product.find()
        .populate({
          path: 'categories',
          populate: {
            path: 'parentCategory',
            select: 'name'
          },
          select: 'name parentCategory'
        })
        .lean();

      // Populate attributes with specific values
      for (const product of products) {
        for (const attribute of product.attributes) {
          const attributeData = await Attribute.findById(attribute.attributeId, 'name').lean();
          attribute.name = attributeData.name;
        }
      }

      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  addProduct: async (productData) => {
    try {
      for (const attr of productData.attributes) {
        const attribute = await Attribute.findById(attr.attributeId);
        if (!attribute) {
          throw new Error(`Invalid attribute with ID ${attr.attributeId}`);
        }
        if (!attribute.values.includes(attr.value)) {
          attribute.values.push(attr.value);
          await attribute.save();
        }
      }

      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = productService;
