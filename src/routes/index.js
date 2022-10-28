var express = require("express");
var router = express.Router();
var homeController = require("../controllers/homeController");

let initWebRouter = (app) => {
  router.get("/user/regis", homeController.createUser);
  router.get("/user/login", homeController.login);
  app.use("/", router);
};

module.exports = initWebRouter;
