const Attribute = require('../Model/Attributes');
const Product = require('../Model/Products');

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
  },
  deleteAttribute: async (attributeId) => {
    try {
      // Step 1: Check if the attribute is used in any product
      const productUsingAttribute = await Product.findOne({
        "attributes.attributeId": attributeId,
      });
  
      // Step 2: If attribute is used in any product, return an error message
      if (productUsingAttribute) {
        return {
          success: false,
          message: "This attribute is used in a product and cannot be deleted.",
        };
      }
  
      // Step 3: If attribute is not used, delete the attribute
      const deletedAttribute = await Attribute.findByIdAndDelete(attributeId);
  
      // Step 4: Return success response
      if (deletedAttribute) {
        return {
          success: true,
          message: "Attribute deleted successfully.",
        };
      } else {
        return {
          success: false,
          message: "Attribute not found.",
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getAllAttributes: async () => {
    try {
      const attributes = await Attribute.find();
      return attributes;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  updateAttributeInfo : async (attributeName, info) => {
    try {
      // Find the attribute by its name and update the info field
      const updatedAttribute = await Attribute.findOneAndUpdate(
        { name: attributeName },  // Find by attribute name
        { info: info },            // Update the info field
        { new: true }              // Return the updated document
      );
  
      if (!updatedAttribute) {
        return { error: 'Attribute not found' };
      }
  
      return {success : true , message : 'Updated Info'}; 
    } catch (error) {
      // Handle any errors that occur during the update
      console.error('Error updating attribute info:', error);
      throw new Error('Failed to update attribute info');
    }
  }
  
  
};

module.exports = attributeService;
