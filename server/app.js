const express = require("express");
require("./config/passport-setup");
require("./config/cron-setup");
const CLIENT_URL = "http://localhost:3000";
const cors = require("cors");
const app = express();
const session = require("express-session");
const port = process.env.PORT || 5000;
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const licenseRoutes = require("./routes/license");
const notificationRoutes = require("./routes/notification");
const requestRoutes = require("./routes/request");
const bookingRoutes = require("./routes/booking");
const mongoURI = "mongodb://localhost:27017/eriWeb";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const clientP = new Promise(function (resolve, reject) {
  resolve(mongoose.connection.getClient());
  reject(new Error("MongoClient Error"));
});
const sessionStore = MongoStore.create({
  clientPromise: clientP,
});

const sessionMiddleware = session({
  cookie: { httpOnly: false, expires: 259200000 },
  secret: "secret",
  key: "connect.sid",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/license", licenseRoutes);
app.use("/notification", notificationRoutes);
app.use("/request", requestRoutes);
app.use("/booking", bookingRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
