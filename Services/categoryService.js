const Category = require('../Model/Category');
const Product = require('../Model/Products');

const categoryService = {
  getAllCategories: async () => {
    try {
      const categories = await Category.find().populate('parentCategory', 'name');
      return categories;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  addCategory: async (categoryData) => {
    try {
      const category = new Category(categoryData);
      return await category.save();
    } catch (error) {
      throw new Error(error);
    }
  },
  
  updateCategory: async (categoryId, newName, newImage) => {
    try {
      // Find the category by ID
      const category = await Category.findById(categoryId);
  
      // Check if the category exists
      if (!category) {
        return false;
      }
  
      // Update the category's name and image
      category.name = newName || category.name;
      category.image = newImage || category.image;
  
      // Save the updated category
      await category.save();
  
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  deleteCategory: async (categoryId) => {
    try {
      // Step 1: Check if the category is used in any product
      const productUsingCategory = await Product.findOne({
        categories: categoryId,
      });
      
  
      // Step 2: If the category is used in any product, return an error message
      if (productUsingCategory) {
        return {
          success: false,
          message: "This category is used in a product and cannot be deleted.",
        };
      }
  
      // Step 3: If the category is not used, delete the category
      const deletedCategory = await Category.findByIdAndDelete(categoryId);
  
      // Step 4: Return success response
      if (deletedCategory) {
        return {
          success: true,
          message: "Category deleted successfully.",
        };
      } else {
        return {
          success: false,
          message: "Category not found.",
        };
      }
    } catch (error) {
      console.log(error);
      
      throw new Error(error.message);
    }
  },
  
  
};

module.exports = categoryService;
