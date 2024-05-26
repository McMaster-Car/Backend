// attribute.controller.js
const attributeService = require('../Services/AttributeService');

const attributeController = {
  getAllAttributes: async (req, res) => {
    try {
      const attributes = await attributeService.getAllAttributes();
      return res.status(200).json({ success: true, attributes });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  },

  addAttribute: async (req, res) => {
    try {
      const newAttribute = await attributeService.addAttribute(req.body);
      return res.status(201).json({ success: true, attribute: newAttribute });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  },

  addValueToAttribute: async (req, res) => {
    try {
      const { name, value } = req.body;
      
      const updatedAttribute = await attributeService.addValueToAttribute(name, value);
      return res.status(200).json({ success: true, attribute: updatedAttribute });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  }
};

module.exports = attributeController;
