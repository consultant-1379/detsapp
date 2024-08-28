const router = require("express").Router();
const userManager = require("../dbmanager/userManager");
const User = require("../entities/user");
const bcrypt = require("bcrypt");

router.get("/all", async (req, res) => {
  try {
    const users = await userManager.getAllUsers();
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send({
      error: "There is something wrong with the server. Please try again later",
    });
  }
});

router.get("/multiple", async (req, res) => {
  try {
    const users = await userManager.getMultipleUsers(JSON.parse(req.query.ids));
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send({
      error: "There is something wrong with the server. Please try again later",
    });
  }
});

//update user by id
router.put("/", async (req, res) => {
  try {
    const check = await userManager.checkUserExist(
      req.body.username,
      req.body.email
    );
    for (let i = 0; i < check.length; i++) {
      if (check[i]._id.toString() !== req.user._id.toString()) {
        return res.status(200).send({
          error: "Username or email already exist",
        });
      }
    }
    const user = new User.Builder()
      .setUsername(req.body.username)
      .setEmail(req.body.email)
      .setBookingAdmin(req.body.bookingAdmin)
      .setLicenseAdmin(req.body.licenseAdmin)
      .build();
    const updatedUser = await userManager.updateUser(req.user._id, user);
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(400).send({
      error: "There is something wrong with the server. Please try again later",
    });
  }
});

router.put("/password", async (req, res) => {
  try {
    if (await bcrypt.compare(req.body.old, req.user.password)) {
      const hashedPassword = await bcrypt.hash(req.body.new, 10);
      const updatedUser = await userManager.updatePassword(
        req.user._id,
        hashedPassword
      );
      res.status(200).send(updatedUser);
    } else {
      res.status(200).send({
        error: "Wrong password",
      });
    }
  } catch (err) {
    res.status(400).send({
      error: "There is something wrong with the server. Please try again later",
    });
  }
});

//get user by characters
router.get("/search", async (req, res) => {
  try {
    const users = await userManager.getUsersByChar(req.query.char);
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send({
      error: "There is something wrong with the server. Please try again later",
    });
  }
});

//get user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await userManager.getUserById(req.params.id);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send({
      error: "There is something wrong with the server. Please try again later",
    });
  }
});

module.exports = router;
