var express = require("express");
var router = express.Router();
var homeController = require("../controllers/homeController");

let initWebRouter = (app) => {
  router.get("/user/regis", homeController.createUser);
  app.use("/", router);
};

module.exports = initWebRouter;
