const mongoose = require('mongoose');
const Attribute = require('../../Model/Attributes');
const Category = require('../../Model/Category');
const Product = require('../../Model/Products');
const Variation = require('../../Model/Variations');

/**
 * Function to get or create an attribute.
 * @param {string} name - The name of the attribute.
 * @param {string} value - The value of the attribute.
 * @param {mongoose.ClientSession} session - The session for the transaction.
 * @returns {Object} - The attribute ID and value.
 */
const getOrCreateAttribute = async (name, value, session) => {
    let attribute = await Attribute.findOne({ name }).session(session);
    if (attribute) {
        // Check if the value already exists in the values array
        if (!attribute.values.includes(value)) {
            // Add the new value to the values array
            attribute.values.push(value);
            await attribute.save({ session });
        }
    } else {
        // Create a new attribute if it does not exist
        attribute = new Attribute({ name, values: [value] });
        await attribute.save({ session });
    }
    return { attributeId: attribute._id, value };
};

/**
 * Function to get or create a category.
 * @param {string} categoryPath - The category path string.
 * @param {mongoose.ClientSession} session - The session for the transaction.
 * @returns {ObjectId} - The ID of the last category in the path.
 */
const getOrCreateCategory = async (categoryPath, session) => {
    const categories = categoryPath.split('>').map(c => c.trim()).filter(c => c);
    let parentCategory = null;

    for (let i = categories.length - 1; i >= 0; i--) {
        const categoryName = categories[i];
        if (!categoryName) continue; // Skip empty category names

        let category = await Category.findOne({ name: categoryName, parentCategory }).session(session);
        if (!category) {
            category = new Category({ name: categoryName, parentCategory });
            await category.save({ session });
        }
        parentCategory = category._id;
    }

    return parentCategory;
};

/**
 * Function to create a product with variations.
 * @param {Object[]} dataArray - The array of product data.
 */
const createProductWithVariations = async (dataArray) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        for (const data of dataArray) {
            const categories = await getOrCreateCategory(data["Product categories"], session);
            const attributesPromises = new Map();
            const variationAttributesPromises = new Map();
            const variationOthers = {};

            Object.keys(data).forEach(key => {
                if (key.startsWith('Attribute Name (pa_')) {
                    const attributeName = data[key];
                    const attributeValueKey = `Attribute Value (${key.split('(')[1]}`;
                    const attributeValue = data[attributeValueKey];

                    // Ensure attributeName and attributeValue are non-empty
                    if (attributeName && attributeValue) {
                        if (!attributesPromises.has(attributeName + attributeValue)) {
                            const attributePromise = getOrCreateAttribute(attributeName, attributeValue, session);
                            attributesPromises.set(attributeName + attributeValue, attributePromise);
                            variationAttributesPromises.set(attributeName + attributeValue, attributePromise);
                        }
                    }
                } else if (!['Product categories', 'ID', 'Sku', 'Content', 'Short Description', 'Web Product Code', 'Title', 'Post Type', 'Parent Product ID', 'Stock Status', 'Regular Price', 'McMaster Carr Part No', 'Product Type', 'Product visibility', 'Status'].includes(key) &&
                    !key.startsWith('Attribute') && key !== 'Picture') {
                    variationOthers[key] = data[key];
                }
            });

            const attributes = await Promise.all(attributesPromises.values());
            const variationAttributes = await Promise.all(variationAttributesPromises.values());

            const product = new Product({
                name: data["Title"],
                description: data['Short Description'],
                SKU: data['Sku'],
                categories: [categories],
                attributes: attributes,
            });

            const variation = new Variation({
                attributes: variationAttributes,
                retailPrice: data['Regular Price'],
                isStockAvailable: data['Stock Status'].toLowerCase() === 'instock',
                picture: data['Picture'],
                others: variationOthers,
            });

            product.variations.push(variation._id);
            await product.save({ session });
            await variation.save({ session });
        }
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

module.exports = {
    createProductWithVariations,
};
