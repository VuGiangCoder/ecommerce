const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const middleware = require('../middleware/middleware');

router.post('/regis', userController.createUser);
router.post('/login', userController.login);
router.get('/profile',middleware.verifyToken, userController.getInfo);
router.get('/search_product', userController.searchProduct);
// router.get("/cart/", userController.getCart);
// router.get("/forget_password", userController.forgetPassword);
// router.post("/order/", userController.orderItem);
// router.post("/cancel_order/:orderId", userController.cancelOrder);
// router.post("/change_password/", userController.changePassword);
// router.get("/list_comment", userController.listComment);

module.exports = router;
