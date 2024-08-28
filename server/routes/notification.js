const router = require("express").Router();
const notificationManager = require("../dbmanager/notificationManager");

//delete all notification by user id
router.delete("/all", async (req, res) => {
  try {
    await notificationManager.deleteAllNotification(req.user._id);
    res.status(200).send({ message: "All notifications deleted" });
  } catch (err) {
    res
      .status(400)
      .send({ error: "There was an error deleting the notifications" });
  }
});

//get all notifications by user id
router.get("/all", async (req, res) => {
  try {
    const type = req.query.type;
    const notifications = await notificationManager.getAllNotification(
      req.user._id,
      type
    );
    res.status(200).send(notifications);
  } catch (err) {
    res.status(400).send({
      error: "There is something wrong with the server. Please try again later",
    });
  }
});

//delete notification by id
router.delete("/:id", async (req, res) => {
  try {
    const notification = await notificationManager.deleteNotification(
      req.params.id
    );
    res.status(200).send(notification);
  } catch (err) {
    res.status(400).send({
      error: "There is something wrong with the server. Please try again later",
    });
  }
});

module.exports = router;
