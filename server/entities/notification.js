"use strict";

class Notification {
  constructor(build) {
    if (arguments.length === 1 && this.validateBuild(build)) {
      const userId = build.userId;
      const dataId = build.dataId;
      const message = build.message;
      const type = build.type
      const dateOfCreation = build.dateOfCreation;
      const seen = build.seen;

      Object.defineProperties(this, {
        userId: {
          value: userId,
          writable: false,
        },
        dataId: {
          value: dataId,
          writable: false,
        },
        message: {
          value: message,
          writable: false,
        },
        dateOfCreation: {
          value: dateOfCreation,
          writable: false,
        },
        seen: {
          value: seen,
          writable: false,
        },
        type: {
          value: type,
          writable: false,
        }
      });
    }
  }
  validateBuild(build) {
    return String(build.constructor) === String(Notification.Builder);
  }
  static get Builder() {
    class Builder {
      setUserId(userId) {
        this.userId = userId;
        return this;
      }
      setDataId(dataId) {
        this.dataId = dataId;
        return this;
      }
      setMessage(message) {
        this.message = message;
        return this;
      }
      setDateOfCreation(dateOfCreation) {
        this.dateOfCreation = dateOfCreation;
        return this;
      }
      setSeen(seen) {
        this.seen = seen;
        return this;
      }
      setType(type) {
        this.type = type;
        return this;
      }
      build() {
        return new Notification(this);
      }
    }
    return Builder;
  }
}

module.exports = Notification;
