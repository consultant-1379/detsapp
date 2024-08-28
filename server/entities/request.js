"use strict";

class Request {
  constructor(build) {
    if (arguments.length === 1 && this.validateBuild(build)) {
      const senderId = build.senderId;
      const type = build.type;
      const dateOfCreation = build.dateOfCreation;

      Object.defineProperties(this, {
        senderId: {
          value: senderId,
          writable: false,
        },
        type: {
          value: type,
          writable: false,
        },
        dateOfCreation: {
          value: dateOfCreation,
          writable: false,
        },
      });
    }
  }
  validateBuild(build) {
    return String(build.constructor) === String(Request.Builder);
  }
  static get Builder() {
    class Builder {
      setSenderId(senderId) {
        this.senderId = senderId;
        return this;
      }
      setType(type) {
        this.type = type;
        return this;
      }
      setDateOfCreation(dateOfCreation) {
        this.dateOfCreation = dateOfCreation;
        return this;
      }
      build() {
        return new Request(this);
      }
    }
    return Builder;
  }
}


module.exports = Request;