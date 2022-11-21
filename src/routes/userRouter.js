const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');

router.post('/regis', userController.createUser);
router.post('/login', userController.login);
// router.get("/profile", userController.getInfo);
// router.get("/search", userController.searchProduct);
// router.get("/cart/", userController.getCart);
// router.get("/forget_password", userController.forgetPassword);
// router.post("/order/", userController.orderItem);
// router.post("/cancel_order/:orderId", userController.cancelOrder);
// router.post("/change_password/", userController.changePassword);
// router.get("/list_comment", userController.listComment);

module.exports = router;
