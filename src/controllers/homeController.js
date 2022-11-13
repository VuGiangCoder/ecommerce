const db = require("../models/index");
const crudService = require("../service/CRUDservice");
const sendMail = require("../service/sendMail");
var cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const { createJWT } = require("../middleware/JWTAction");
const jwt = require("jsonwebtoken");
let createUser = async (req, res) => {
  let flag = await crudService.createNewUser(req.body);
  let user = await db.User.findOne({
    where: {
      email: req.body.email,
    },
    attributes: {
      exclude: ["password"],
    },
  });
  if (flag === true) {
    sendMail(req.body.email, "Xác thực đăng ký", JSON.stringify(user));
    return res.status(200).json({
      message: "Xác thực đăng ký trong email",
      errCode: 0,
    });
  } else {
    return res.status(200).json({ message: "email has used" });
  }
};
let login = async (req, res) => {
  let check = await crudService.signIn(req);
  if (check === false) {
    res.status(404).json({
      message: "Tài khoản mật khẩu không chính xác",
      errCode: 0,
    });
  } else {
    let user = await db.User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["password"],
      },
    });
    let token = createJWT(user.id, user.email, user.position);
    res.status(200).json({
      message: "Đăng nhập thành công",
      errCode: 0,
      payload: user,
      token: token,
    });
  }
};

let getInfo = async (req, res) => {
  let token = req.params.token;
  try {
    console.log(token);
    var data = jwt.verify(token, process.env.JWT_SECRET);
    console.log(data.email);
    let user = await db.User.findOne({
      where: {
        email: data.email,
      },
      attributes: {
        exclude: ["password"],
      },
    });
    if (user === null) {
      res.status(200).json({
        message: "email không đúng",
        errCode: 0,
      });
    } else {
      res.status(200).json({
        message: "Thông tin người dùng",
        errCode: 0,
        payload: user,
        notifile: "",
      });
    }
  } catch (error) {
    console.log("loi server");
  }
};
module.exports = {
  createUser,
  login,
  getInfo,
};
