const express = require("express");
const router = express.Router();
const userRouter = require("./userRouter");

let initWebRouter = (app) => {
  app.use("/user", userRouter);
};

module.exports = initWebRouter;
