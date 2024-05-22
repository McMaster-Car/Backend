const Attribute = require('../Model/Attributes');

const attributeService = {
  getAllAttributes: async () => {
    try {
      const attributes = await Attribute.find();
      return attributes;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  addAttribute: async (attributeData) => {
    try {
      const attribute = new Attribute(attributeData);
      return await attribute.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  addValueToAttribute: async (name, value) => {
    try {
      const attribute = await Attribute.findOne({ name });
      if (!attribute) {
        throw new Error(`Attribute with name ${name} not found`);
      }
      attribute.values.push(value);
      return await attribute.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = attributeService;
