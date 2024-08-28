"use strict";

class User {
  constructor(build) {
    if (arguments.length === 1 && this.validateBuild(build)) {
      const username = build.username;
      const email = build.email;
      const password = build.password;
      const licenseAdmin = build.licenseAdmin;
      const bookingAdmin = build.bookingAdmin;

      Object.defineProperties(this, {
        username: {
          value: username,
          writable: false,
        },
        email: {
          value: email,
          writable: false,
        },
        password: {
          value: password,
          writable: false,
        },
        licenseAdmin: {
          value: licenseAdmin,
          writable: false,
        },
        bookingAdmin: {
          value: bookingAdmin,
          writable: false,
        },
      });
    }
  }
  validateBuild(build) {
    return String(build.constructor) === String(User.Builder);
  }
  static get Builder() {
    class Builder {
      setUsername(username) {
        this.username = username;
        return this;
      }
      setEmail(email) {
        this.email = email;
        return this;
      }
      setPassword(password) {
        this.password = password;
        return this;
      }
      setLicenseAdmin(licenseAdmin) {
        this.licenseAdmin = licenseAdmin;
        return this;
      }
      setBookingAdmin(bookingAdmin) {
        this.bookingAdmin = bookingAdmin;
        return this;
      }
      build() {
        return new User(this);
      }
    }
    return Builder;
  }
}

module.exports = User;
