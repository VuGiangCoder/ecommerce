var express = require("express");
var router = express.Router();
var homeController = require("../controllers/homeController");

let initWebRouter = (app) => {
  router.post("/user/regis", homeController.createUser);
  router.get("/user/login", homeController.login);
  router.get("/user/profile", homeController.getInfo);
  router.get("/user/search", homeController.searchProduct);
  router.get("/user/cart", homeController.getCart);
  app.use("/", router);
};

module.exports = initWebRouter;
