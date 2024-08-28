"use strict";

class License {
  constructor(build) {
    if (arguments.length === 1 && this.validateBuild(build)) {
      const creator = build.creator;
      const deploymentName = build.deploymentName;
      const description = build.description;
      const expiryDate = build.expiryDate;
      const dateOfCreation = build.dateOfCreation;
      const podName = build.podName;

      Object.defineProperties(this, {
        creator: {
          value: creator,
          writable: false,
        },
        deploymentName: {
          value: deploymentName,
          writable: false,
        },
        description: {
          value: description,
          writable: false,
        },
        expiryDate: {
          value: expiryDate,
          writable: false,
        },
        dateOfCreation: {
          value: dateOfCreation,
          writable: false,
        },
        podName: {
          value: podName,
          writable: false,
        },
      });
    }
  }
  validateBuild(build) {
    return String(build.constructor) === String(License.Builder);
  }
  static get Builder() {
    class Builder {
      setCreator(creator) {
        this.creator = creator;
        return this;
      }
      setDeploymentName(deploymentName) {
        this.deploymentName = deploymentName;
        return this;
      }
      setDescription(description) {
        this.description = description;
        return this;
      }
      setExpiryDate(expiryDate) {
        this.expiryDate = expiryDate;
        return this;
      }
      setDateOfCreation(dateOfCreation) {
        this.dateOfCreation = dateOfCreation;
        return this;
      }
      setPodName(podName) {
        this.podName = podName;
        return this;
      }
      build() {
        return new License(this);
      }
    }
    return Builder;
  }
}

module.exports = License;
