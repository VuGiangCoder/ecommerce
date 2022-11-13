var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv").config();
const { createJWT } = require("./middleware/JWTAction");
var indexRouter = require("./routes/index");
const connectDB = require("./config/connectDB");
const initWebRouter = require("./routes/index");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
connectDB();

// createJWT();

initWebRouter(app);

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

let port = process.env.port || 6969;
app.listen(port, () => {
  console.log("server run on port :" + port);
});
