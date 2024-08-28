"use strict";

const License = require("../models/licenseModel");

class licenseManager {
  static async createNewLicense(license) {
    try {
      const docs = await License.create(this.contructLicense(license));
      return docs;
    } catch (err) {
      throw err;
    }
  }
  static contructLicense(license) {
    return {
      creator: license.creator,
      deploymentName: license.deploymentName,
      description: license.description,
      expiryDate: license.expiryDate,
      dateOfCreation: license.dateOfCreation,
      podName: license.podName
    };
  }
  static async getAllLicenses() {
    try {
      const res = await License.find({}).sort({ dateOfCreation: -1 }).exec();
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  static async getLicenceById(id) {
    try {
      const res = await License.findById(id);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async getLicenseByName(name){
    try{
      const res = await License.findOne({deploymentName: name});
      return res;
    }catch(err){
      console.log(err);
      throw err;
    }
  }

  static async updateLicense(id, license) {
    try {
      const res = await License.findByIdAndUpdate(
        id,
        this.contructLicense(license),
        { new: true }
      );
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  static async deleteLicense(id) {
    try {
      const res = await License.findByIdAndDelete(id);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = licenseManager;
