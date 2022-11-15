var express = require("express");
var router = express.Router();
const userRouter = require("./userRouter");

let initWebRouter = (app) => {
  app.use("/user", userRouter);
};

module.exports = initWebRouter;
