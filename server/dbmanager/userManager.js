"use strict";

const User = require("../models/userModel");

class UserManager {
  static async createNewUser(user) {
    try {
      const docs = await User.create(this.contructUser(user));
    } catch (err) {
      throw err;
    }
  }
  static contructUser(user) {
    return {
      username: user.username,
      password: user.password,
      email: user.email,
      licenseAdmin: user.licenseAdmin,
      bookingAdmin: user.bookingAdmin,
    };
  }
  static async getUserByName(username) {
    try {
      const res = await User.findOne({ username: username });
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  static async getUserById(id) {
    try {
      const res = await User.findById(id, { password: 0 });
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async checkUserExist(username, email) {
    try {
      const res = await User.find({
        $or: [{ username: username }, { email: email }],
      });
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async updateUser(id, user) {
    try {
      const res = await User.findByIdAndUpdate(
        id,
        { username: user.username, email: user.email },
        { new: true }
      );
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async updatePassword(id, password) {
    try {
      const res = await User.findByIdAndUpdate(
        id,
        { password: password },
        { new: true }
      );
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async updateUserRole(id, type) {
    try {
      let res;
      if (type === "license")
        res = await User.findByIdAndUpdate(id, { licenseAdmin: role });
      else res = await User.findByIdAndUpdate(id, { bookingAdmin: role });
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async getMultipleUsers(list) {
    try {
      const res = await User.find({ _id: { $in: list } }, { password: 0 });
      return res;
    } catch (err) {
      throw err;
    }
  }

  static async deleteUser(id) {
    try {
      const res = await User.findByIdAndDelete(id);
      return res;
    } catch (err) {
      throw err;
    }
  }

  static async getUsersByChar(char) {
    try {
      const res = await User.find(
        {
          $or: [{ username: { $regex: char } }, { email: { $regex: char } }],
        },
        { password: 0 }
      );
      return res;
    } catch (err) {
      throw err;
    }
  }

  static async getAllUser() {
    try {
      const res = await User.find({}, { password: 0 });
      return res;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserManager;
