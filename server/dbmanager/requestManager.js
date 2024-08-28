const Request = require("../models/requestModel");

class RequestManager {
  static async createRequest(request) {
    try {
      const docs = await Request.create(this.contructRequest(request));
      return docs;
    } catch (err) {
      throw err;
    }
  }
  static contructRequest(request) {
    return {
      senderId: request.senderId,
      type: request.type,
      dateOfCreation: request.dateOfCreation,
    };
  }

  //get all requests by type
  static async getAllRequest(type) {
    try {
      const res = await Request.find({ type: { $in: type } })
        .sort({ dateOfCreation: -1 })
        .exec();
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  //delete request by id
  static async deleteRequest(id) {
    try {
      const res = await Request.findByIdAndDelete(id);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async getRequestBySenderId(senderId) {
    try {
      const res = await Request.find({ senderId: senderId });
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = RequestManager;
