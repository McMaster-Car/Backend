const Product = require('../../Model/Products');
const Attribute = require('../../Model/Attributes');
const Variation = require('../../Model/Variations')
const Category  = require('../../Model/Category')
const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const { createProductWithVariations } = require('./createProduct');


/**
 * Converts a CSV file to a JSON object.
 * @param {string} filePath - The path to the CSV file.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of JSON objects.
 */
const CSVtoJSON = (filePath) => {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  };
  
  /**
   * Converts an Excel file to a JSON object.
   * @param {string} filePath - The path to the Excel file.
   * @returns {Object[]} - An array of JSON objects.
   */
  const ExceltoJSON = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
  };

  const dataService = {
    DataUpload: async (filePath, mimeType) => {
      let data;
  
      try {
        // Parse the file based on its MIME type
        if (mimeType === 'text/csv') {
          data = await CSVtoJSON(filePath);
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          data = await ExceltoJSON(filePath);
        } else {
          throw new Error('Unsupported file format');
        }
  
        if (data && data.length > 0) {
          // Split data into chunks of 50
          const chunkSize = 10;
          for (let i = 0; i < data.length; i += chunkSize) {

            const chunk = data.slice(i, i + chunkSize);
          console.log("data to be added is from " , i , " to " , i+chunkSize)
            await createProductWithVariations(chunk);
          }
        }
  
        return 'data added';
      } catch (error) {
        console.error('Error processing file:', error);
        throw error;
      }
    },
  };
  

  module.exports = dataService;