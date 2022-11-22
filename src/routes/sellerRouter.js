const express = require('express');

const router = express.Router();
const middleware = require('../middleware/middleware');
const sellerController = require('../controllers/sellerController');

router.get('/list_shop', middleware.verifyToken, middleware.verifySeller, sellerController.getOwnShops);
router.get('/detail_shop/:idShop', middleware.verifyToken, middleware.verifySeller, sellerController.getDetailShop);
router.post('/add_item', middleware.verifyToken, middleware.verifySeller, sellerController.addItem);
router.delete('/remove_item/:idItem', middleware.verifyToken, middleware.verifySeller, sellerController.removeItem);
router.update('/update_item/:idItem', middleware.verifyToken, middleware.verifySeller, sellerController.updateItem);
router.post('/update_shop', middleware.verifyToken, middleware.verifySeller, sellerController.updateInfoShop);
router.post('/add_promotion', middleware.verifyToken, middleware.verifySeller, sellerController.addPromotion);
router.post('/toggle_item_on_promotion', middleware.verifyToken, middleware.verifySeller, sellerController.toggleItemOnPromotion);
router.get('/promotion',middleware.verifyToken,middleware.verifySeller,sellerController.getPromotion);
router.get('/list_client_buy',middleware.verifyToken,middleware.verifySeller,sellerController.getListClientBuy);
router.post('/create_shop', middleware.verifyToken, middleware.verifySeller, sellerController.createShop);
router.post('/update_shop', middleware.verifyToken, middleware.verifySeller, sellerController.updateShop);

module.exports = router;