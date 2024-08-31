const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../../Controllers/categoryController');

categoryRouter.get('/view-categories', categoryController.getAllCategories);
categoryRouter.post('/add-category', categoryController.addCategory);
categoryRouter.put('/edit-category/:id', categoryController.editCategory);
categoryRouter.delete('/delete-category/:id', categoryController.deleteCategory);





module.exports = categoryRouter;
