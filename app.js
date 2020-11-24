/* ===============[ Dependencies  ]========================*/
const path = require("path");
const fs = require("fs");
const env = process.env.NODE_ENV || "development";
require("dotenv").config(); // Set up all environment variables
// require("dotenv").config({
//   path: path.resolve(__dirname, ".env"),
//   debug: (env !== "production") ? true : false,
// });

const envConfig = fs.existsSync(".env.override")
  ? require("dotenv").parse(fs.readFileSync(".env.override"))
  : [];
for (var k in envConfig) {
  process.env[k] = envConfig[k];
}

/* ===============[ Express ]================================*/
const express = require("express");
const createError = require("http-errors");

/* ===============[ Middlewares ]================================*/
const session = require("express-session");
const passport = require("./middlewares/passport");

const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const colors = require("colors");
const utils = require("./utils");

const app = express();

/* ===============[ view engine setup ]=======================*/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
// app.set('view options', {
//   layout: true
// });

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* ===============[ Sessions ]================================*/
// We need to use sessions to keep track of our user's login status
let cookieExpirationTime = new Date();
let time = cookieExpirationTime.getTime();
let seconds = 3600; // 1 hour

time += parseInt(process.env.EXPIRATION) || seconds * 1000; // convert seconds to milliseconds
cookieExpirationTime.setTime(time);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "SuperSecretSession",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: parseInt(process.env.EXPIRATION) || seconds * 1000
      // expires: cookieExpirationTime,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

/* ===============[ Static Assets ]===========================*/
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/jquery",
  express.static(path.join(__dirname, "node_modules/jquery/")),
);
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/")),
);
app.use(
  "/moment",
  express.static(path.join(__dirname, "node_modules/moment/")),
);

app.use(bodyParser.json());
//configures body parser to parse JSON
app.use(bodyParser.urlencoded({ extended: false }));
//configures body parser to parse url encoded data

// Template Variables which can be used on .jade files with =variable or =function()
app.locals = {
  ...app.locals,
  app_name: require("./package.json").name,
  app_version: require("./package.json").version,
  the_year: function () {
    return new Date().getFullYear();
  },
};

/* ===============[ Routes ]==================================*/
const Routes = require("./routes/index");
app.use(Routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

/* ===============[ Generate Keys for Auth ]=========================*/
if (!fs.existsSync("public.pem") || !fs.existsSync("private.pem")) {
  console.log("Generating Keys".yellow);

  setTimeout(() => {
    utils.generateKeysAndSave();
  }, 3000);
}

/* ===============[ Seed DB ]=========================*/
if (
  process.env.DEMO_USER !== undefined &&
  process.env.DEMO_PASSWORD !== undefined
) {
  console.log("Seeding demo user...".yellow);

  setTimeout(() => {
    utils.seed_demo_user();
  }, 3000);
}

if (
  process.env.SEED_EMPLOYEES !== undefined &&
  process.env.SEED_EMPLOYEES == "true"
) {
  console.log("Seeding Employees...".yellow);

  setTimeout(() => {
    utils.seed_employees();
  }, 5000);
}

module.exports = app;
