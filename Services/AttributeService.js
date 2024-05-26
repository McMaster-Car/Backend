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
   addValueToAttribute : async (name, value) => {
    try {
      const attribute = await Attribute.findOne({ name });
      if (!attribute) {
        throw new Error(`Attribute with name ${name} not found`);
      }
  
      if (Array.isArray(value)) {
        // Merge arrays and ensure uniqueness
        attribute.values = [...new Set([...attribute.values, ...value.map(String)])];
      } else {
        // If value is a single item, push it as a string
        attribute.values.push(String(value));
      }
  
      return await attribute.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
};

module.exports = attributeService;
