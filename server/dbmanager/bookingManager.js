const Booking = require("../models/bookingModel");

class bookingManager {
  static async createNewBooking(booking) {
    try {
      const docs = await Booking.create(this.contructBooking(booking));
      return docs;
    } catch (err) {
      throw err;
    }
  }
  static contructBooking(booking) {
    return {
      creator: booking.creator,
      cloudName: booking.cloudName,
      status: booking.status,
      environment: booking.environment,
      envSize: booking.envSize,
      vpn: booking.vpn,
      ticketNumber: booking.ticketNumber,
      startDate: booking.startDate,
      endDate: booking.endDate,
      spocName: booking.spocName,
      teamName: booking.teamName,
      prepDate: booking.prepDate,
      dateOfCreation: booking.dateOfCreation,
    };
  }
  static async getAllBookings() {
    try {
      const res = await Booking.find({}).sort({ dateOfCreation: -1 }).exec();
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  static async getBookingById(id) {
    try {
      const res = await Booking.findById(id);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  //update booking
  static async updateBooking(id, booking) {
    try {
      const res = await Booking.findByIdAndUpdate(
        id,
        this.contructBooking(booking),
        { new: true }
      );
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  static async updateBookingStatus(id, status) {
    try {
      const res = await Booking.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
      );
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  //delete booking
  static async deleteBooking(id) {
    try {
      const res = await Booking.findByIdAndDelete(id);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async getBookingById(id) {
    try {
      const res = await Booking.findById(id);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = bookingManager;
