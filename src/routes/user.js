var express = require("express");
var router = express.Router();
var homeController = require("../controllers/homeController");

let userMethod = (req, res) => {
  router.get("/regis", homeController.createUser);
};
module.exports = userMethod;
