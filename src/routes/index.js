var express = require("express");
var router = express.Router();
const userRouter = require("./userRouter");
const sellerRouter = require("./sellerRouter");

let initWebRouter = (app) => {
  app.use("/user", userRouter);
  app.use("/seller", sellerRouter);
};

module.exports = initWebRouter;
