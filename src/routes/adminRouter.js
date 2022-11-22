const express = require('express');

const router = express.Router();
const middleware = require('../middleware/middleware');
const adminController = require('../controllers/adminController');

router.get('/list_users', middleware.verifyToken, middleware.verifyAdmin, adminController.getUser);
router.post('/notify_user', middleware.verifyToken, middleware.verifyAdmin, adminController.notifyToUser);
router.post('/toggle_status_shop', middleware.verifyToken, middleware.verifyAdmin, adminController.toggleStatusShop);
router.post('/update_user', middleware.verifyToken, middleware.verifyAdmin, adminController.updateUser);
router.get('/orders_user/:idUser',middleware.verifyToken, middleware.verifyAdmin,adminController.getOrderOwnUser);
router.get('/detail_order/:idOrder',middleware.verifyToken,middleware.verifyAdmin,adminController.getDetailOrder);
module.exports = router;
