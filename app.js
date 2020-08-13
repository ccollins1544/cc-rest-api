/* ===============[ Dependencies  ]========================*/
const path = require("path");
const fs = require("fs");
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
  debug: process.env.DEBUG,
});

const envConfig = fs.existsSync(".env.override")
  ? require("dotenv").parse(fs.readFileSync(".env.override"))
  : [];
for (var k in envConfig) {
  process.env[k] = envConfig[k];
}

const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const utils = require("./utils");

const app = express();

/* ===============[ view engine setup ]=======================*/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* ===============[ Sessions ]================================*/
// We need to use sessions to keep track of our user's login status
let cookieExpirationTime = new Date();
let time = cookieExpirationTime.getTime();
let seconds = 3600; // 1 hour

time += process.env.EXPIRATION || seconds * 1000; // convert seconds to milliseconds
cookieExpirationTime.setTime(time);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "SuperSecretSession",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: cookieExpirationTime,
    },
  }),
);

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
  console.log("Generating Keys");
  utils.generateKeys();
}

module.exports = app;
