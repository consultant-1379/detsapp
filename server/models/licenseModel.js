const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

const licenseSchema = new mongoose.Schema({
    creator:ObjectId,
    deploymentName: String,
    description: String,
    expiryDate: Date,
    dateOfCreation: Date,
    podName:String
});


const License = new mongoose.model('License', licenseSchema);

module.exports = License;