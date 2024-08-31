const AttributeRouter = require("express").Router();
const attributeController = require('../../Controllers/attributeController')

AttributeRouter.get('/view-attributes',attributeController.getAllAttributes);
AttributeRouter.delete('/delete-attributes/:id',attributeController.deleteOneAttribute);
AttributeRouter.post('/add-attributes',attributeController.addAttribute);
AttributeRouter.put('/addAttribute/value', attributeController.addValueToAttribute); 
AttributeRouter.put('/updateInfo', attributeController.updateInfo); 


module.exports = AttributeRouter;