const db = require("../models/index");
const crudService = require("../service/CRUDservice");
const sendMail = require("../service/sendMail");
var cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const { createJWT } = require("../middleware/JWTAction");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
var generator = require("generate-password");
require("dotenv").config();

let createNewItem = async (req, res) => {
  let token = req.params.token;
  let data = jwt.verify(token, process.env.JWT_SECRET);
  let itemName = "ô tô";
  let price = 2000;
  let description = "djadadasdasdasdp";
  if (data.position == "seller") {
    let seller = await db.User.findOne({
      where: {
        email: data.email,
      },
    });
    if (seller != null) {
      await db.Item.create(
        {
          shopId: data.id,
          description: description,
          price: price,
          itemType: req.body.itemType,
          promation: req.body.promation,
          quantitiy: req.body.promation,
          name: itemName,
        },
        { plain: true }
      );
      return res.status(200).json({
        message: "Tạo sản phẩm thành công",
        errCode: 0,
      });
    } else {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản",
        errCode: 0,
      });
    }
  } else {
    return res.status(404).json({
      message: "bạn không có quyền",
      errCode: 0,
    });
  }
};
module.exports = {
  createNewItem,
};
