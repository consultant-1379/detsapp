const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const bookingSchema = new mongoose.Schema({
  creator: ObjectId,
  cloudName: String,
  status: String,
  environment: String,
  envSize: String,
  vpn: String,
  ticketNumber: String,
  startDate: Date,
  endDate: Date,
  spocName: [ObjectId],
  teamName: String,
  prepDate: Date,
  dateOfCreation:Date,
});
const Booking = new mongoose.model("Booking", bookingSchema);
module.exports = Booking;
