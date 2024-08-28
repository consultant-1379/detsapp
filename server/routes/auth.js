const router = require("express").Router();
const passport = require("passport");
const UserManager = require("../dbmanager/userManager");
const User = require("../entities/user");
const bcrypt = require("bcrypt");

router.post("/", isAuthenticated, async (req, res) => {
  const user = await UserManager.getUserById(req.user._id);
  res.status(200).send(user);
});
router.post("/login", isNotAuthenticated, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send({ error: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send({ redirect: "/" });
    });
  })(req, res, next);
});

router.post("/register", isNotAuthenticated, async (req, res) => {
  const check = await UserManager.getUserByName(req.body.username);
  if (check) return res.send({ error: "Username already exists" });
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User.Builder()
    .setUsername(req.body.username)
    .setPassword(hashedPassword)
    .setEmail(req.body.email)
    .setLicenseAdmin(false)
    .setBookingAdmin(false)
    .build();
  try {
    await UserManager.createNewUser(user);
    res.status(201).send({ redirect: "/login" });
  } catch (err) {
    res
      .status(400)
      .send("There is something wrong with the server, please try again later");
  }
});

router.post("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) next(err);
  });
  res.redirect("/login");
});

// Check for authentication middlewares
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send({ redirect: "/login" });
}

function isNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.send({ redirect: "/" });
}

module.exports = router;
