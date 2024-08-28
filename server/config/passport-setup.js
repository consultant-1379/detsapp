const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserManager = require("../dbmanager/userManager");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const authenticateUser = async (username, password, done) => {
  const user = await UserManager.getUserByName(username);
  if (user == null)
    return done(null, false, { message: "Invalid Credentials" });

  try {
    if (await bcrypt.compare(password, user.password)) return done(null, user);
    return done(null, false, { message: "Invalid Credentials" });
  } catch (err) {
    return done(err);
  }
};

passport.use(
  new LocalStrategy({ usernameField: "username" }, authenticateUser)
);
