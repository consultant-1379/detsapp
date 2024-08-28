const router = require("express").Router();
const Request = require("../entities/request");
const requestManager = require("../dbmanager/requestManager");
const userManager = require("../dbmanager/userManager");

router.post("/", async (req, res) => {
  try {
    const request = new Request.Builder()
      .setSenderId(req.user._id)
      .setType(req.body.type)
      .setDateOfCreation(new Date())
      .build();
    await requestManager.createRequest(request);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.get("/all", async (req, res) => {
  try {
    const type = [];
    if (req.user.licenseAdmin) type.push("license");
    if (req.user.bookingAdmin) type.push("booking");
    const docs = await requestManager.getAllRequest(type);
    res.send(docs);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const approve = JSON.parse(req.body.approve);
    if (approve) {
      await userManager.updateUserRole(req.body.senderId, req.body.type);
    }
    const id = req.params.id;
    const docs = await requestManager.deleteRequest(id);
    res.send(docs);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: "There is something wrong with server, please try again later",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const docs = await requestManager.getRequestBySenderId(id);
    res.send(docs);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: "There is something wrong with server, please try again later",
    });
  }
});

module.exports = router;
