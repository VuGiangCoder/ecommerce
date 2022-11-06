const { createJWT } = require("../middleware/JWTAction");
const db = require("../models/index");
const crudService = require("../service/CRUDservice");
const sendMail = require("../service/sendMail");

let createUser = async (req, res) => {
  req.body.email = "giang2010gc@gmail.com";
  req.body.password = "abcdef";
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
  req.body.email = "giang2010gc@gmail.com";
  req.body.password = "abcdef";
  try {
    let islogged = await crudService.isLogging(req);
    if (islogged === true) {
      return res.status(200).json({ message: "You are logged in." });
    }

    let signIned = await crudService.signIn(req);
    if (signIned === false) {
      return res
        .status(200)
        .json({ message: "email or password is incorect." });
    } else {
      let payload = crudService.getUserByEmail(req.body.email);
      let getToken = createJWT(payload.id, payload.email, payload.position);
      res.cookie("token", getToken);

      return res.status(200).json({
        message: "Đăng nhập thành công",
        errCode: 0,
        payload: {
          data: payload,
          token: getToken,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

let getInfo = async (req, res) => {
  // let email = req.body.email;
  let email = "giang2010gc@gmail.com";
  console.log(email);
  let payload = await crudService.getUserByEmail(email);
  return res.status(200).json({
    message: "Thông tin người dùng",
    payload: payload,
    token: req.body.token,
  });
};

// thiếu khoảng
let searchProduct = async (req, res) => {
  req.body.name = "quan ao";
  let item = await db.Item.findAll({
    where: {
      name: req.body.name,
    },
    limit: 10,
  });
  let itemImage = await crudService.findItemImage(item.id);
  res.status(200).json({
    message: "Danh sách sản phẩm",
    errCode: 0,
    payload: {
      item: item,
      item_image: itemImage,
    },
  });
};

let getCart = async (req, res) => {
  let email = "giang2010gc@gmail.com";
  let user = await db.User.findOne({
    where: {
      email: email,
    },
  });
  let userId = user.id;
  let cart = await db.Cart.findOne({
    where: {
      userId: userId,
    },
  });
  let itemId = cart.itemId;
  let item = await db.Item.findOne({
    where: {
      id: itemId,
    },
  });
  return res.status(200).json({
    message: "giỏ hàng người dùng",
    errCode: 0,
    payload: {
      item: item,
    },
  });
};
module.exports = {
  createUser,
  login,
  getInfo,
  searchProduct,
  getCart,
};
