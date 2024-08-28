const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;


const notificationSchema = new mongoose.Schema({
    dateOfCreation: Date,
    message: String,
    userId:ObjectId,
    type:String,
    dataId:ObjectId,
    seen:Boolean,
});


const Notification = new mongoose.model('Notification', notificationSchema);
module.exports = Notification;