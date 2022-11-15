var express = require("express");
var router = express.Router();
var userController = require("../controllers/userController");

router.post("/regis", userController.createUser);
router.get("/login", userController.login);
router.get("/profile/:token", userController.getInfo);
router.get("/search", userController.searchProduct);
router.get("/cart/:token", userController.getCart);
router.get("/forget_password", userController.forgetPassword);
router.post("/order/:token", userController.orderItem);
router.post("/cancel_order/:orderId/:token", userController.cancelOrder);
router.post("/change_password/:token", userController.changePassword);
router.post("/favorite/shop/:shopId/:token", userController.likeShop);
router.post("/un_favorite/shop/:shopId/:token", userController.unlikeShop);
router.get("/user/list_comment/:token", userController.listComment);

module.exports = router;
