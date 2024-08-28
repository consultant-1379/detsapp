const cron = require("node-cron");
const Notification = require("../entities/notification");
const notificationManager = require("../dbmanager/notificationManager");
const userManager = require("../dbmanager/userManager");
const licenseManager = require("../dbmanager/licenseManager");
const bookingManager = require("../dbmanager/bookingManager");

//function for day difference
function dayDifference(date1, date2) {
  const diff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diff / (1000 * 3600 * 24));
}
//cron schedule for 24 hours
// */10 * * * * * //test for every 10 sec
cron.schedule("0 0 0 * * *", async () => {
  try {
    const licenses = await licenseManager.getAllLicenses();
    let licenseAdmin = await userManager.getAllUser();
    licenseAdmin = licenseAdmin.filter((user) => user.licenseAdmin === true);
    const today = new Date();
    licenses.forEach(async (license) => {
      const licenseDate = new Date(license.expiryDate);
      const daysLeft = dayDifference(today, licenseDate);
      if (daysLeft === 14) {
        licenseAdmin.forEach(async (admin) => {
          const notification = new Notification.Builder()
            .setUserId(admin._id)
            .setDataId(license._id)
            .setDateOfCreation(new Date())
            .setMessage(`is expiring in ${daysLeft} days`)
            .setSeen(false)
            .setType("license")
            .build();
          await notificationManager.createNotification(notification);
        });
      } else if (daysLeft <= 7 && daysLeft > 0) {
        licenseAdmin.forEach(async (admin) => {
          const notification = new Notification.Builder()
            .setUserId(admin._id)
            .setDataId(license._id)
            .setDateOfCreation(new Date())
            .setMessage(`is expiring in ${daysLeft} days`)
            .setSeen(false)
            .setType("license")
            .build();
          await notificationManager.createNotification(notification);
        });
      } else if (daysLeft === 0) {
        licenseAdmin.forEach(async (admin) => {
          const notification = new Notification.Builder()
            .setUserId(admin._id)
            .setDataId(license._id)
            .setDateOfCreation(new Date())
            .setMessage(`is expiring today`)
            .setSeen(false)
            .setType("license")
            .build();
          await notificationManager.createNotification(notification);
        });
      } else if (daysLeft === -1) {
        licenseAdmin.forEach(async (admin) => {
          const notification = new Notification.Builder()
            .setUserId(admin._id)
            .setDataId(license._id)
            .setDateOfCreation(new Date())
            .setMessage(`has expired`)
            .setSeen(false)
            .setType("license")
            .build();
          await notificationManager.createNotification(notification);
        });
      } else if (daysLeft < -5) {
        await notificationManager.deleteAllNotificationByLicenseId(license._id);
      }
    });
    let bookingAdmins = await userManager.getAllUser();
    bookingAdmins = bookingAdmins.filter((user) => user.bookingAdmin === true);
    const bookings = await bookingManager.getAllBookings();
    bookings.forEach(async (booking) => {
      if (new Date(booking.prepDate) >= today) {
        const daysLeft = dayDifference(today, new Date(booking.prepDate));
        bookingAdmins.forEach(async (user) => {
          const notification = new Notification.Builder()
            .setUserId(user._id)
            .setDataId(booking._id)
            .setDateOfCreation(new Date())
            .setMessage(`please prepare in ${daysLeft} days`)
            .setSeen(false)
            .setType("booking")
            .build();
          await notificationManager.createNotification(notification);
        });
      } else if (dayDifference(today, new Date(booking.startDate)) === 0) {
        await bookingManager.updateBookingStatus(booking._id, "Booked");
      } else if (dayDifference(today, new Date(booking.endDate)) === 0) {
        await bookingManager.updateBookingStatus(
          booking._id,
          "Rejected/Closed"
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
});
