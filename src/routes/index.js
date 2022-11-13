var express = require("express");
var router = express.Router();
var homeController = require("../controllers/homeController");

let initWebRouter = (app) => {
  router.post("/user/regis", homeController.createUser);
  router.get("/user/login", homeController.login);
  router.get("/user/profile/:token", homeController.getInfo);
  // router.get("/user/search", homeController.searchProduct);
  // router.get("/user/cart", homeController.getCart);
  // router.get("/user/forget_password", homeController.forgetPassWord);
  // router.post("/user/order", homeController.oderItem);
  // router.post("//user/cancel_order", homeController.cancelOrder);
  // router.post("/user/change_password", homeController.changePassWord);
  app.use("/", router);
};

module.exports = initWebRouter;
