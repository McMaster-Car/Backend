const AttributeRouter = require("express").Router();
const attributeController = require('../../Controllers/attributeController')

AttributeRouter.get('/view-attributes',attributeController.getAllAttributes);
AttributeRouter.post('/add-attributes',attributeController.addAttribute);
AttributeRouter.put('/addAttribute/value', attributeController.addValueToAttribute); // New route for adding a value

module.exports = AttributeRouter;