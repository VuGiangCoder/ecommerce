const { json } = require("sequelize");
const { UPSERT } = require("sequelize/types/query-types");
const db = require("../models/index");
const crudService = require("../service/CRUDservice");

let createUser = async function (req, res) {
  let flag = await crudService.createNewUser(req.body);
  if (flag == true) {
    let message =
      '200: {message : "Xác thực đăng ký trong email" , errCode : 0}';
    res.send(message);
  } else {
  }
};
let login = async (req, res) => {
  try {
    let islogged = await crudService.isLogging(req);
    if (islogged === true) {
      let message = "You are logged in.";
      return res.send(JSON.stringify(message));
    }
    let signIned = await crudService.signIn(req);
    if (signIned === false) {
      let message = "email or password is incorect.";
      return res.send(JSON.stringify(message));
    } else {
      let info = await User.findAll({ include: Notifie });
      let message =
        '200:{message:"Login succesfully",errCode = 0,' + info + "}";
      res.send(JSON.stringify(message));
    }
  } catch (error) {}
};

module.exports = {
  createUser,
  login,
};
