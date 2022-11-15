var express = require("express");
var router = express.Router();
var sellerController = require("../controllers/sellerController");

router.post("/create_item/:token", sellerController.createNewItem);

module.exports = router;
