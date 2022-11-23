const express = require('express');

const router = express.Router();
const middleware = require('../middleware/middleware');
const userController = require('../controllers/userController');

router.post('/regis', userController.createUser);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/profile', middleware.verifyToken, userController.getInfo);
router.get('/search_product', userController.searchProduct);
router.get('/detail_item/:idItem', userController.getDetailItem);
router.post('/change_passowrd', middleware.verifyToken, userController.changePassword);
router.get('/forget_passowrd', userController.forgetPassword);
router.post('/confirm_password', userController.confirmPassword);
router.post('/update_profile', middleware.verifyToken, userController.updateUser);
router.get('/cart', middleware.verifyToken, middleware.verifyBuyer, userController.getCart);
router.post('/order_item', middleware.verifyToken, middleware.verifyBuyer, userController.orderItems);
router.get('/cancel_item/:idOrder', middleware.verifyToken, middleware.verifyBuyer, userController.cancelItems);
router.post('/review_item', middleware.verifyToken, middleware.verifyBuyer, userController.reviewItem);
router.get('/list_orders', middleware.verifyToken, middleware.verifyBuyer, userController.getHistoryOrder);
router.get('/list_shop_favorite', middleware.verifyToken, middleware.verifyBuyer, userController.getListShopFavorite);
router.get('/toggle_shop_favorite', middleware.verifyToken, middleware.verifyBuyer, userController.toggleFavoriteShop);
router.get('/detail_order/:idOrder', middleware.verifyToken,  userController.getDetailOrder);
router.get('/detail_item/:idItem', userController.getDetailItem);
router.get('/detail_shop/:idShop', userController.getDetailShop);
router.get('/update_notify/:idNotify', middleware.verifyToken, userController.updateNotify);

router.post('/payment',middleware.verifyToken, middleware.verifyBuyer, userController.paymentByPaypal);
router.get('/payment/success',userController.paymentSuccess);
router.get('/payment/cancel',userController.paymentCancel);
router.get('/check_order', middleware.verifyToken, middleware.verifyBuyer, userController.checkSuccess);
router.post('/chat', middleware.verifyToken, userController.chat);
module.exports = router;
