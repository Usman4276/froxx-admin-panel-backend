var createError = require("http-errors");
var cors = require("cors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var connectionToMongoDB = require("./config/connection");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRoutes = require("./routes/admin");

var app = express();

//Global variables
global.__basedir = __dirname;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));

//Connection to DB
connectionToMongoDB();

//All routes
app.use("/", indexRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/user", usersRouter);

// Catch-all route to serve the 'index.html' file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

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

module.exports = app;
