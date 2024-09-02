// product.service.js
const Product = require('../Model/Products');
const Attribute = require('../Model/Attributes');
const Variation = require('../Model/Variations')
const Category = require('../Model/Category');





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
        .limit(250)
        .exec();

      return products.map(product => {
        const attributes = product.attributes.map(attr => {
          const attribute = attr.attributeId;
          return {
            attributeId: attribute._id,
            attributeName: attribute.name, // Assuming your Attribute model has a name field
            values: attr.values,
            info: attr.info
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


  getEveryProduct: async () => {
    try {
      const products = await Product.find()
        .populate({
          path: 'attributes.attributeId',
          model: 'Attribute'
        })
        .populate('categories')
        .populate('variations')
        .limit(250)
        .exec();

      const expandedProducts = [];

      products.forEach(product => {
        product.variations.forEach(variation => {
          const productAttributes = product.attributes.map(attr => {

            return {
              attributeId: attr.attributeId._id,
              attributeName: attr.attributeId.name, // Assuming your Attribute model has a name field
              values: attr.values,
              info: attr.attributeId.info ? attr.attributeId.info : ""
            };
          });

          const variationAttributes = variation.attributes.map(varAttr => {
            const attribute = productAttributes.find(attr => attr.attributeId.equals(varAttr.attributeId));
            return {
              attributeId: varAttr.attributeId,
              attributeName: attribute ? attribute.attributeName : '',
              value: varAttr.value,
              info: attribute.info

            };
          });

          expandedProducts.push({
            _id: product._id,

            name: product.name,
            SKU: product.SKU,
            Parent_Product_ID: product.Parent_Product_ID,
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
              others: variation.others
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
  getProductWithVariations: async (parentID) => {
    try {
      // Fetch all products with the specified Parent_Product_ID
      const products = await Product.find({ Parent_Product_ID: parentID })
        .populate({
          path: 'attributes.attributeId',
          model: 'Attribute'
        })
        .populate('variations')
        .limit(250)
        .exec();

      if (products.length === 0) {
        return null;
      }


      const productWithVariations = {
        name: products[0].name,
        SKU: products[0].SKU,
        Parent_Product_ID: products[0].Parent_Product_ID,
        description: products[0].description,
        variations: []
      };

      products.forEach(product => {
        product.variations.forEach(variation => {
          const variationAttributes = variation.attributes.map(varAttr => {
            const attribute = product.attributes.find(attr => attr.attributeId._id.equals(varAttr.attributeId));
            return {
              attributeId: varAttr.attributeId,
              attributeName: attribute ? attribute.attributeId.name : '',
              value: varAttr.value
            };
          });

          productWithVariations.variations.push({
            _id: variation._id,
            attributes: variationAttributes,
            retailPrice: variation.retailPrice,
            salePrice: variation.salePrice,
            stockQuantity: variation.stockQuantity,
            isStockAvailable: variation.isStockAvailable,
            picture: variation.picture,
            weight: variation.weight,
            dimensions: variation.dimensions,
            others: variation.others
          });
        });
      });

      return productWithVariations;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  updateProductData: async (ProductId, name,
    SKU,
    description) => {
    try {
      // Find the category by ID
      console.log(name,
        SKU,
        description);

      const UpdatedProduct = await Product.findById(ProductId);

      if (!UpdatedProduct) {
        return false;
      }

      // Update the UpdatedProduct's name and image
      UpdatedProduct.name = name || UpdatedProduct.name;
      UpdatedProduct.SKU = SKU || UpdatedProduct.SKU;
      UpdatedProduct.description = description || UpdatedProduct.description;


      console.log(UpdatedProduct.name, UpdatedProduct.SKU, UpdatedProduct.description);

      // Save the updated category
      await UpdatedProduct.save();

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  updateVariationData: async (
                              variationID,
                              rp,
                              sp,
                              sq,
                              isStock,
                              pic
  ) => {
    try {


      const updatedVariation = await Variation.findById(variationID);

      if (!updatedVariation) {
        return false;
      }

      updatedVariation.retailPrice = rp || updatedVariation.retailPrice
      updatedVariation.salePrice = sp || updatedVariation.salePrice
      updatedVariation.stockQuantity = sq || updatedVariation.stockQuantity
      updatedVariation.isStockAvailable = isStock || updatedVariation.isStockAvailable
      updatedVariation.picture = pic || updatedVariation.picture

      await updatedVariation.save();

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  getProductThroughVariation : async (req, res) => {
    try {
      const  variationId  = req.params.id;
  
      if (!variationId) {
        return res.status(400).send({ error: 'variationId is required' });
      }
  
      // Find the product with the given variationId
      const product = await Product.findOne({ variations: variationId });
  
      if (!product) {
        return res.status(404).send({ error: 'Product not found' });
      }
  
      res.status(200).send({ productId: product._id , productName : product.name , description : product.description });
    } catch (error) {
      res.status(500).send({ error: 'Server error' });
    }
  },
  deleteProduct: async (productId) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        throw new Error('Product not found');
      }
      return {
        success: true,
        message: 'Product is Deleted Successfully'
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }


};


module.exports = productService;
