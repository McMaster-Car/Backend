const categoryService = require('../Services/categoryService');

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await categoryService.getAllCategories();
      return res.status(200).json({ success: true, categories });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  },

  addCategory: async (req, res) => {
    try {
      const newCategory = await categoryService.addCategory(req.body);
      return res.status(201).json({ success: true, category: newCategory });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  },
  editCategory: async (req, res) => {
    try {
      const id = req.params.id
      const newCategory = await categoryService.updateCategory(id, req.body.name, req.body.image);
      return res.status(201).json({ success: true, category: newCategory });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id
      const DeleteCategory = await categoryService.deleteCategory(id);
      return res.status(200).json({
        success: DeleteCategory.success,
        message: DeleteCategory.message
      });

    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  }

};

module.exports = categoryController;
