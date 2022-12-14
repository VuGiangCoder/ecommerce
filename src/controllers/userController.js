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

let createUser = async (req, res) => {
  req.body.email = "giang2010gc1331@gmail.com";
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

let searchProduct = async (req, res) => {
  var name = "quan ao";
  var priceMin = 1200;
  var priceMax = 2000;
  var page = 2;
  var size = 1;

  let skip = (page - 1) * size;
  var item = await db.Item.findAll({
    where: {
      name: name,
      price: {
        [Op.between]: [priceMin, priceMax],
      },
    },
    limit: size,
    offset: skip,
  });
  if (item == null) {
    res.status(200).json({
      message: "Không có săn phẩm nào",
      errCode: 0,
    });
  } else {
    return res.status(200).json({
      message: "Danh sách sản phẩm",
      errCode: 0,
      payload: item,
      page: page,
      pageTotal: 10,
      size: size,
    });
  }
};

let getCart = async (req, res) => {
  let token = req.params.token;
  let page = 1;
  let size = 1;

  try {
    var data = jwt.verify(token, process.env.JWT_SECRET);
    var email = data.email;
    console.log(email);
    let user = await db.User.findOne({
      where: {
        email: email,
      },
      attributes: {
        exclude: ["password"],
      },
    });
    var userId = user.id;
    console.log(userId);
    let cart = await db.Cart.findAll({
      where: {
        userId: userId,
      },
    });
    console.log(cart[0].itemId);
    let item = await db.Item.findAll({
      where: {
        [Op.or]: [
          { id: cart[0].itemId },
          { id: cart[1].itemId },
          { id: cart[2].itemId },
          { id: cart[3].itemId },
          { id: cart[4].itemId },
          { id: cart[5].itemId },
        ],
      },
      limit: size,
      offset: (page - 1) * size,
    });
    if (cart == null) {
      return res.status(200).json({
        message: "Không có mặt hàng nào trong giỏ",
        errCode: 0,
      });
    } else {
      return res.status(200).json({
        message: "Giỏ hàng người dùng",
        errCode: 0,
        payload: {
          page: page,
          size: size,
          totalPage: 10,
          cart: item,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

let forgetPassword = async (req, res) => {
  let email = "giang2010gc@gmail.com";
  let user = await db.User.findOne({
    where: {
      email: email,
    },
  });
  let newPassword = generator.generate({
    length: 10,
    numbers: true,
  });
  let password = await crudService.hashUSerPassword(newPassword);
  await user.set({
    password: password,
  });
  await user.save();

  sendMail(email, "Quên mật khẩu", "password mới: " + newPassword);
  return res.status(200).json({
    message: "Check mail để có xác nhận khôi phục mật khẩu",
    errCode: 0,
  });
};

let orderItem = async (req, res) => {
  let token = req.params.token;
  let itemId = 1;
  let quantity = 10;
  let paymentMethod = "Thanh toán khi nhận hàng";

  try {
    let data = jwt.verify(token, process.env.JWT_SECRET);
    let user = await db.User.findOne({
      where: {
        email: data.email,
      },
      attributes: {
        exclude: ["password"],
      },
    });
    if (user != null) {
      await db.Order.create({
        shopId: req.query.shopId,
        userId: user.id,
        itemId: req.query.itemId,
        quantity: req.query.quantity,
        status: req.query.status,
        timeOder: req.query.timeOder,
        paymentMethod: req.query.paymentMethod,
        addressReceive: req.query.addressReceive,
        phoneContact: req.query.phoneContact,
      });
      return res.status(200).json({
        message: "Đặt đơn thành công",
        errCode: 0,
      });
    } else {
      return res.status(200).json({
        message: "Yêu cầu đăng nhập để tiếp tục",
        errCode: 0,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

let cancelOrder = async (req, res) => {
  let token = req.params.token;
  let data = jwt.verify(token, process.env.JWT_SECRET);
  await db.Order.destroy({
    where: {
      id: req.params.orderId,
      userId: data.id,
    },
    force: true,
  });
  return res.status(200).json({
    message: "Huỷ đơn hàng thành công",
    errCode: 0,
  });
};

let changePassword = async (req, res) => {
  let token = req.params.token;

  //let currentPassword = req.body.currentPassword;
  let currentPassword = "Yle4FB7OGh";
  //let newPassword = req.body.newPassword;
  let newPassword = "abcdef";
  try {
    let data = jwt.verify(token, process.env.JWT_SECRET);
    let user = await db.User.findOne({
      where: {
        email: data.email,
      },
    });
    if (user == null) {
      return res.status(404).json({
        message: "Yêu cầu đăng nhập",
        errCode: 0,
      });
    } else {
      let check = await bcrypt.compare(currentPassword, user.password);
      if (check) {
        let password = await crudService.hashUSerPassword(newPassword);
        await user.set({
          password: password,
        });
        await user.save();
        return res.status(200).json({
          message: "Đổi mật khẩu thành công",
          errCode: 0,
        });
      } else {
        return res.status(304).json({
          message: "Yêu cầu đăng nhập",
          errCode: 0,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Lỗi server",
      error: 1,
    });
  }
};

let likeShop = async (req, res) => {
  let token = req.params.token;
  let shopId = req.params.shopId;
  try {
    let data = jwt.verify(token, process.env.JWT_SECRET);
    let shop = await db.Shop.findOne({
      where: {
        id: shopId,
      },
    });
    if (shop == null) {
      return res.status(404).json({
        message: "Shop not found",
        errCode: 0,
      });
    } else {
      console.log("oke");
      let user = await db.User.findOne({
        where: {
          email: data.email,
        },
      });
      if (user == null) {
        return res.status(404).json({
          message: "Yêu cầu đăng nhập",
          errCode: 0,
        });
      } else {
        let like = shop.like;
        await shop.set({
          like: like + 1,
        });
        await shop.save();
        return res.status(200).json({
          message: "Thích cửa hàng thành công",
          errCode: 0,
        });
      }
    }
  } catch {
    return res.status(500).json({
      message: "Lỗi server",
      errCode: 1,
    });
  }
};

let unlikeShop = async (req, res) => {
  let token = req.params.token;
  let shopId = req.params.shopId;
  try {
    let data = jwt.verify(token, process.env.JWT_SECRET);
    let shop = await db.Shop.findOne({
      where: {
        id: shopId,
      },
    });
    if (shop == null) {
      return res.status(404).json({
        message: "Shop not found",
        errCode: 0,
      });
    } else {
      console.log("oke");
      let user = await db.User.findOne({
        where: {
          email: data.email,
        },
      });
      if (user == null) {
        return res.status(404).json({
          message: "Yêu cầu đăng nhập",
          errCode: 0,
        });
      } else {
        let like = shop.like;
        if (like === 0) {
          like = 1;
        }
        await shop.set({
          like: like - 1,
        });
        await shop.save();
        return res.status(200).json({
          message: "Bỏ thích cửa hàng thành công",
          errCode: 0,
        });
      }
    }
  } catch {
    return res.status(500).json({
      message: "Lỗi server",
      errCode: 1,
    });
  }
};

let listComment = async (req, res) => {
  let token = req.params.token;
  let page = 1;
  let size = 1;

  try {
    var data = jwt.verify(token, process.env.JWT_SECRET);
    var email = data.email;
    console.log(email);
    let user = await db.User.findOne({
      where: {
        email: email,
      },
      attributes: {
        exclude: ["password"],
      },
    });
    var userId = user.id;
    let comment = await db.Recomment.findAll({
      where: {
        userId: userId,
      },
    });
    let commentImage = await db.ItemImage.findAll({
      where: {
        [Op.or]: [
          { id: comment[0].commentId },
          { id: comment[1].commentId },
          { id: comment[2].commentId },
          { id: comment[3].commentId },
          { id: comment[4].commentId },
          { id: comment[5].commentId },
          { id: comment[6].commentId },
          { id: comment[7].commentId },
          { id: comment[8].commentId },
          { id: comment[9].commentId },
          { id: comment[10].commentId },
          { id: comment[11].commentId },
          { id: comment[12].commentId },
          { id: comment[13].commentId },
          { id: comment[14].commentId },
          { id: comment[15].commentId },
          { id: comment[16].commentId },
          { id: comment[17].commentId },
        ],
      },
      limit: size,
      offset: (page - 1) * size,
    });
    if (comment == null) {
      return res.status(200).json({
        message: "Không có comment nao",
        errCode: 0,
      });
    } else {
      return res.status(200).json({
        message: "Danh sách comment người dùng",
        errCode: 0,
        payload: {
          comment: comment,
          commentImage: commentImage,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  createUser,
  login,
  getInfo,
  searchProduct,
  getCart,
  forgetPassword,
  orderItem,
  cancelOrder,
  changePassword,
  likeShop,
  unlikeShop,
  listComment,
};
