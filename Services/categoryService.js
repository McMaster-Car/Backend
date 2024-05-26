const Category = require('../Model/Category');

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
  }
};

module.exports = categoryService;
