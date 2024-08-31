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
  getProductWithVariations: async (req, res) => {
    try {
      const id = req.params.id
      const isParentID = req.params.isParentID

      if (isParentID) {
        const products = await productService.getProductWithVariations(id)
        return res.status(200).json({ success: true, message: "Parent ID does not exists", data: products });

      }
      else {
        return res.status(200).json({ success: true, message: "Parent ID does not exists", data: id });
      }

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
  },
  deleteOneProduct: async (req, res) => {
    try {
      const newProduct = await productService.deleteProduct(req.params.id);
      return res.status(200).json({ success: newProduct.success, message: newProduct.message });
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
    }
  },
  editProductData: async (req, res) => {
    try {
      const id = req.params.id



      const edited = await productService.updateProductData(id, req.body.data.name, req.body.data.SKU, req.body.data.description);
      return res.status(201).json({ success: true, isEdited: edited });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  },
  editVariationData: async (req, res) => {
    try {
      const id = req.params.id



      const edited = await productService.updateVariationData(
        id, req.body.data.retailPrice,
        req.body.data.salePrice, req.body.data.stockQuantity,
        req.body.data.isStockAvailable, req.body.data.picture
      );
      return res.status(201).json({ success: true, isEdited: edited });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  },

};

module.exports = productController;
