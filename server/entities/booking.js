"use strict";

class Booking {
  constructor(build) {
    if (arguments.length === 1 && this.validateBuild(build)) {
      const creator = build.creator;
      const cloudName = build.cloudName;
      const status = build.status;
      const environment = build.environment;
      const envSize = build.envSize;
      const vpn = build.vpn;
      const ticketNumber = build.ticketNumber;
      const startDate = build.startDate;
      const endDate = build.endDate;
      const spocName = build.spocName;
      const teamName = build.teamName;
      const prepDate = build.prepDate;
      const dateOfCreation = build.dateOfCreation;

      Object.defineProperties(this, {
        creator: {
          value: creator,
          writable: false,
        },
        cloudName: {
          value: cloudName,
          writable: false,
        },
        status: {
          value: status,
          writable: false,
        },
        environment: {
          value: environment,
          writable: false,
        },
        envSize: {
          value: envSize,
          writable: false,
        },
        vpn: {
          value: vpn,
          writable: false,
        },
        ticketNumber: {
          value: ticketNumber,
          writable: false,
        },
        startDate: {
          value: startDate,
          writable: false,
        },
        endDate: {
          value: endDate,
          writable: false,
        },
        spocName: {
          value: spocName,
          writable: false,
        },
        teamName: {
          value: teamName,
          writable: false,
        },
        prepDate: {
          value: prepDate,
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
    return String(build.constructor) === String(Booking.Builder);
  }
  static get Builder() {
    class Builder {
      setCreator(creator) {
        this.creator = creator;
        return this;
      }
      setCloudName(cloudName) {
        this.cloudName = cloudName;
        return this;
      }
      setStatus(status) {
        this.status = status;
        return this;
      }
      setEnvironment(environment) {
        this.environment = environment;
        return this;
      }
      setEnvSize(envSize) {
        this.envSize = envSize;
        return this;
      }
      setVpn(vpn) {
        this.vpn = vpn;
        return this;
      }
      setTicketNumber(ticketNumber) {
        this.ticketNumber = ticketNumber;
        return this;
      }
      setStartDate(startDate) {
        this.startDate = startDate;
        return this;
      }
      setEndDate(endDate) {
        this.endDate = endDate;
        return this;
      }
      setSpocName(spocName) {
        this.spocName = spocName;
        return this;
      }
      setTeamName(teamName) {
        this.teamName = teamName;
        return this;
      }
      setPrepDate(prepDate) {
        this.prepDate = prepDate;
        return this;
      }
      setDateOfCreation(dateOfCreation) {
        this.dateOfCreation = dateOfCreation;
        return this;
      }
      build() {
        return new Booking(this);
      }
    }
    return Builder;
  }
}

module.exports = Booking;
