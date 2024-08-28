"use strict";

const Notification = require("../models/notificationModel");

class NotificationManager {
  static async createNotification(notification) {
    try {
      const docs = await Notification.create(
        this.contructNotification(notification)
      );
      return docs;
    } catch (err) {
      throw err;
    }
  }
  static contructNotification(notification) {
    return {
      userId: notification.userId,
      dataId: notification.dataId,
      message: notification.message,
      dateOfCreation: notification.dateOfCreation,
      seen: notification.seen,
      type:notification.type
    };
  }

  //get all notifications by user id
  static async getAllNotification(id,type) {
    try {
      const res = await Notification.find({ userId: id,type:type })
        .sort({ dateOfCreation: -1 })
        .exec();
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  //delete notification by id
  static async deleteNotification(id) {
    try {
      const res = await Notification.findByIdAndDelete(id);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  //delete all notification by license id
  static async deleteAllNotificationByLicenseId(id) {
    try {
      await Notification.deleteMany({ dataId: id });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  //delete all notifications by user id
  static async deleteAllNotification(id) {
    try {
      await Notification.deleteMany({ userId: id });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = NotificationManager;
