// product.service.js
const Product = require('../Model/Products');
const Attribute = require('../Model/Attributes');
const Variation = require('../Model/Variations')
const Category  = require('../Model/Category')
const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');

// const parseCSV = (filePath) => {
//   return new Promise((resolve, reject) => {
//     const results = [];
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (data) => results.push(data))
//       .on('end', () => resolve(results))
//       .on('error', (error) => reject(error));
//   });
// };

// const parseExcel = (filePath) => {
//   const workbook = xlsx.readFile(filePath);
//   const sheetName = workbook.SheetNames[0];
//   const sheet = workbook.Sheets[sheetName];
//   return xlsx.utils.sheet_to_json(sheet);
// };

// const processProductData = async (data) => {
//   for (const row of data) {
//     // Handle attributes
//     const attributeIds = [];
//     const attributes = row.attributes.split(',').map(attr => {
//       const [name, value] = attr.split(':').map(item => item.trim());
//       return { name, value };
//     });

//     for (const attribute of attributes) {
//       let attributeEntry = await Attribute.findOne({ name: attribute.name });
//       if (!attributeEntry) {
//         attributeEntry = new Attribute({ name: attribute.name, values: [attribute.value] });
//         await attributeEntry.save();
//       } else if (!attributeEntry.values.includes(attribute.value)) {
//         attributeEntry.values.push(attribute.value);
//         await attributeEntry.save();
//       }
//       attributeIds.push({ attributeId: attributeEntry._id, values: [attribute.value] });
//     }

//     // Handle categories
//     const categoryIds = [];
//     const categories = row.categories.split(',').map(cat => cat.trim());

//     for (const category of categories) {
//       let categoryEntry = await Category.findOne({ name: category });
//       if (!categoryEntry) {
//         categoryEntry = new Category({ name: category });
//         await categoryEntry.save();
//       }
//       categoryIds.push(categoryEntry._id);
//     }

//     // Handle variations
//     const variationDetails = row.variation.split(',').reduce((acc, varDet) => {
//       const [key, value] = varDet.split(':').map(item => item.trim());
//       acc[key] = key === 'isStockAvailable' ? value === 'true' : value;
//       return acc;
//     }, {});

//     const variationAttributes = await Promise.all(
//       attributes.map(async attr => {
//         const attributeEntry = await Attribute.findOne({ name: attr.name });
//         return { attributeId: attributeEntry._id, value: attr.value };
//       })
//     );

//     const variation = new Variation({ ...variationDetails, attributes: variationAttributes });
//     await variation.save();

//     // Create and save the product
//     const newProduct = new Product({
//       name: row.name,
//       description: row.description,
//       attributes: attributeIds,
//       categories: categoryIds,
//       variations: [variation._id]
//     });
//     await newProduct.save();
//   }
// };


const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

const parseExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
};

const getCategoryHierarchy = async (categoryPath) => {
  const categoryNames = categoryPath.split('>');
  let parentCategory = null;
  let categoryId = null;

  for (const name of categoryNames) {
    let category = await Category.findOne({ name, parentCategory });
    if (!category) {
      category = new Category({ name, parentCategory });
      await category.save();
    }
    categoryId = category._id;
    parentCategory = category._id;
  }
  return categoryId;
};

const processProductData = async (data) => {
  const batchSize = 100;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);

    const attributeMap = new Map();
    const categoryMap = new Map();

    const productPromises = batch.map(async (row) => {
      const productName = row['Title'] ? row['Title'].trim() : null;
      if (!productName) {
        console.error('Product name is missing in row:', row);
        return; // Skip this row if the product name is missing
      }

      // Handle attributes
      const attributeIds = [];
      const attributes = Object.keys(row)
        .filter(key => key.startsWith('Attribute Name'))
        .map(key => {
          const nameKey = key;
          const valueKey = key.replace('Attribute Name', 'Attribute Value');
          const name = row[nameKey] ? row[nameKey].trim() : null;
          const value = row[valueKey] ? row[valueKey].trim() : '';
          return { name, value };
        })
        .filter(attr => attr.name); // Ensure name is not null or empty

      for (const attribute of attributes) {
        let attributeEntry = attributeMap.get(attribute.name);
        if (!attributeEntry) {
          attributeEntry = await Attribute.findOne({ name: attribute.name });
          if (!attributeEntry) {
            attributeEntry = new Attribute({ name: attribute.name, values: [attribute.value] });
            await attributeEntry.save();
          } else if (!attributeEntry.values.includes(attribute.value)) {
            attributeEntry.values.push(attribute.value);
            await attributeEntry.save();
          }
          attributeMap.set(attribute.name, attributeEntry);
        }
        attributeIds.push({ attributeId: attributeEntry._id, values: [attribute.value] });
      }

      // Handle categories
      const categoryIds = [];
      const categoryPath = row['Product categories'];
      if (categoryPath) {
        const categories = categoryPath.split(',');
        for (const category of categories) {
          let categoryId = categoryMap.get(category.trim());
          if (!categoryId) {
            categoryId = await getCategoryHierarchy(category.trim());
            categoryMap.set(category.trim(), categoryId);
          }
          if (categoryId) {
            categoryIds.push(categoryId);
          }
        }
      }

      // Handle variations
      const variationDetails = {
        retailPrice: row['Regular Price'],
        stockQuantity: row['Stock Status'],
        isStockAvailable: row['Stock Status'] === 'instock',
      };

      const variationAttributes = await Promise.all(
        attributes.map(async attr => {
          const attributeEntry = await Attribute.findOne({ name: attr.name });
          return { attributeId: attributeEntry._id, value: attr.value };
        })
      );

      const variation = new Variation({ ...variationDetails, attributes: variationAttributes });
      await variation.save();

      // Create and save the product
      const newProduct = new Product({
        name: productName,
        description: row['Short Description'],
        attributes: attributeIds,
        categories: categoryIds,
        variations: [variation._id]
      });

      await newProduct.save();
    });

    await Promise.all(productPromises);
    console.log(`Processed batch`);
  }
};





const productService = {
  getAllProducts: async () => {
    try {
      const products = await Product.find()
        .populate({
          path: 'attributes.attributeId',
          model: 'Attribute'
        })
        .populate('categories')
        .populate('variations')
        .exec();
  
      return products.map(product => {
        const attributes = product.attributes.map(attr => {
          const attribute = attr.attributeId;
          return {
            attributeId: attribute._id,
            attributeName: attribute.name, // Assuming your Attribute model has a name field
            values: attr.values
          };
        });
  
        return {
          ...product.toObject(),
          attributes
        };
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
  ClientDataUpload: async (filePath, mimeType) => {
    let data;

    if (mimeType === 'text/csv') {
      data = await parseCSV(filePath);
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      data = parseExcel(filePath);
    } else {
      throw new Error('Unsupported file format');
    }

    await processProductData(data);
  },
 
  // uploadProducts : async (filePath, mimeType) => {
  //   let data;
  
  //   if (mimeType === 'text/csv') {
  //     data = await parseCSV(filePath);
  //   } else if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
  //     data = parseExcel(filePath);
  //   } else {
  //     throw new Error('Unsupported file format');
  //   }
  
  //   await processProductData(data);
  // },
  getEveryProduct : async () => {
    try {
      const products = await Product.find()
        .populate({
          path: 'attributes.attributeId',
          model: 'Attribute'
        })
        .populate('categories')
        .populate('variations')
        .exec();
  
      const expandedProducts = [];
  
      products.forEach(product => {
        product.variations.forEach(variation => {
          const productAttributes = product.attributes.map(attr => {
            return {
              attributeId: attr.attributeId._id,
              attributeName: attr.attributeId.name, // Assuming your Attribute model has a name field
              values: attr.values
            };
          });
  
          const variationAttributes = variation.attributes.map(varAttr => {
            const attribute = productAttributes.find(attr => attr.attributeId.equals(varAttr.attributeId));
            return {
              attributeId: varAttr.attributeId,
              attributeName: attribute ? attribute.attributeName : '',
              value: varAttr.value
            };
          });
  
          expandedProducts.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            categories: product.categories,
            variation: {
              _id: variation._id,
              attributes: variationAttributes,
              retailPrice: variation.retailPrice,
              salePrice: variation.salePrice,
              stockQuantity: variation.stockQuantity,
              isStockAvailable: variation.isStockAvailable,
              picture: variation.picture,
              weight: variation.weight,
              dimensions: variation.dimensions,
              others : variation.others
            }
          });
        });
      });
  
      return expandedProducts;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  addProduct: async (productData) => {
    try {
     

      const variationIds = [];
      for (const variationData of productData.variations) {
        const variation = new Variation(variationData);
        await variation.save();
        variationIds.push(variation._id);
      }

      delete productData.variations;

      const product = new Product({ ...productData, variations: variationIds });
      return await product.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
};


module.exports = productService;
