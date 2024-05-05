const mongoose = require('mongoose');

const BoltAndScrews = new mongoose.Schema({
    "Bickle Part Numbers" : {
      type : String,
      required: true,
    },
    "Country of Origin": { type: String, required: true },
    "Category": { type: String, required: true },
    "Sub Category": { type: String, required: true },
    "Sub 2 Cateogory": { type: String },
    "Sub 3 Category": { type: String },
    "Yasin": { type: String },
    "Pitch TPI (Diameter)": { type: String,  },
    "Thread (diameter)": { type: String, },
    "Equivivalent Diameter": { type: String, },
    "Thread Pitch": { type: String,  },
    "Pitch": { type: String },
    "Bearing Surface": { type: String },
    "Body (length)": { type: String, },
    "Threading": { type: String, },
    "Thread Lg Min": { type: String },
    "Thread Spacing": { type: String },
    "Thread Type": { type: String,  },
    "Head (Width)": { type: String, },
    "Head (Height)": { type: String, },
    "Wrench Size": { type: String,  },
    "Tensile (Strength PSI)": { type: String,  },
    "Specification Met": { type: String,},
    "Package (Quantity)": { type: Number, },
    "Package Cost(2023)": { type: String,  },
    "Description pt": { type: Object,  },
    "Thread Direction": { type: String,  },
    "Material": { type: String, },
    "System Of Measurement": { type: String,  },
    "Fastener Head Type": { type: String,  },
    "Tip Type": { type: String },
    "Drive Style": { type: String },
    "Fastener Strength": { type: String },
    "Grade": { type: String,  },
    "Surface": { type: String },
    "Hardness": { type: String },
    "MFG Part 1 Number": { type: String },
    "MFG Part 2 Number": { type: String },
    "MFG Part 3 Number": { type: String },
    "MFG Part 4 Number": { type: String },
    "MFG Part 5 Number": { type: String },
    "MFG Part 6 Number": { type: String },
    "Rounded Head Style": { type: String },
    "Thread Fit": { type: String },
    "Socket Head Profile": { type: String },
    "Free Fit": { type: String },
    "Close Fit": { type: String }
});


const BoltAndScrewsModel = mongoose.model('BoltAndScrews', BoltAndScrews);

module.exports = BoltAndScrewsModel
