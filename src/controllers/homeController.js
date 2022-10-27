const db = require("../models/index");
const crudService = require("../service/CRUDservice");

let createUser = async function (req, res) {
  // email: data.email,
  // password: hashPasswordFromBcrypt,
  // fullname: data.fullname,
  // position: data.position,
  // phoneNumber: data.phoneNumber,
  // gender: data.gender === "1" ? true : false,
  // imageAvartar: data.imageAvartar,
  // limitCreateShop: data.limitCreateShop,
  // address: data.address,
  // status: data.status,
  req.body.email = "abcaisc@da";
  req.body.password = "dajsdoiad";
  req.body.position = "ojsdpadop";
  await crudService.createNewUser(req.body);
  let message = '200: {message : "Xác thực đăng ký trong email" , errCode : 0}';
  res.send(message);
};

module.exports = {
  createUser,
};
