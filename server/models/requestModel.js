const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const requestSchema = new mongoose.Schema({
  senderId: ObjectId,
  type: String,
  dateOfCreation: Date,
});

const Request = new mongoose.model("Request", requestSchema);

module.exports = Request;
