const router = require("express").Router();
const Booking = require("../entities/booking");
const bookingManager = require("../dbmanager/bookingManager");

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const booking = new Booking.Builder()
      .setCreator(req.body.creator)
      .setCloudName(req.body.cloudName)
      .setStatus(req.body.status)
      .setEnvironment(req.body.environment)
      .setEnvSize(req.body.envSize)
      .setVpn(req.body.vpn)
      .setTicketNumber(req.body.ticketNumber)
      .setStartDate(new Date(req.body.startDate))
      .setEndDate(new Date(req.body.endDate))
      .setSpocName(req.body.spocName)
      .setTeamName(req.body.teamName)
      .setPrepDate(new Date(req.body.prepDate))
      .setDateOfCreation(new Date())
      .build();
    const doc = await bookingManager.createNewBooking(booking);
    res.send(doc);
  } catch (err) {
    console.log(err);
    res.send({ error: "Error in creating booking" });
  }
});

//get all bookings
router.get("/all", async (req, res) => {
  try {
    const bookings = await bookingManager.getAllBookings();
    res.send(bookings);
  } catch (err) {
    console.log(err);
    res.send({ error: "Error in getting bookings" });
  }
});

//update booking
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const booking = new Booking.Builder()
      .setCreator(req.body.creator)
      .setCloudName(req.body.cloudName)
      .setStatus(req.body.status)
      .setEnvironment(req.body.environment)
      .setEnvSize(req.body.envSize)
      .setVpn(req.body.vpn)
      .setTicketNumber(req.body.ticketNumber)
      .setStartDate(new Date(req.body.startDate))
      .setEndDate(new Date(req.body.endDate))
      .setSpocName(req.body.spocName)
      .setTeamName(req.body.teamName)
      .setPrepDate(new Date(req.body.prepDate))
      .setDateOfCreation(req.body.dateOfCreation)
      .build();
    const doc = await bookingManager.updateBooking(id, booking);
    res.send(doc);
  } catch (err) {
    console.log(err);
    res.send({ error: "Error in updating booking" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await bookingManager.deleteBooking(id);
    res.send(doc);
  } catch (err) {
    console.log(err);
    res.send({ error: "Error in deleting booking" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await bookingManager.getBookingById(id);
    res.send(doc);
  } catch (err) {
    console.log(err);
    res.send({ error: "Error in getting booking" });
  }
});
module.exports = router;
