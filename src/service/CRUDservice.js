const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const db = require("../models/index");

let hashUSerPassword = async (password) => {
  return await bcrypt.hashSync(password, salt);
};

let createNewUser = async (data) => {
  let check = (await db.User.findOne({
    where: {
      email: data.email,
    },
  }))
    ? true
    : false;
  if (!check) {
    let hashPasswordFromBcrypt = await hashUSerPassword(data.password);
    await db.User.create(
      {
        email: data.email,
        password: hashPasswordFromBcrypt,
        fullname: data.fullname,
        position: data.position,
        phoneNumber: data.phoneNumber,
        gender: data.gender === "1" ? true : false,
        imageAvartar: data.imageAvartar,
        limitCreateShop: data.limitCreateShop,
        address: data.address,
        status: data.status,
      },
      {
        plain: true,
      }
    );
    return true;
  } else {
    return false;
  }
};

let getUserById = async (id) => {
  try {
    return await db.User.findOne({
      where: {
        id: id,
      },
    });
  } catch (e) {
    return null;
  }
};
let getUserByEmail = async (email) => {
  try {
    return await db.User.findOne({
      where: {
        email: email,
      },
      attributes: {
        exclude: ["password"],
      },
    });
  } catch (e) {
    return null;
  }
};
let getUserTokenByToken = async (token) => {
  try {
    return await db.Usertoken.findOne({
      where: {
        token: token,
      },
    });
  } catch (e) {
    return null;
  }
};

let signIn = async (req) => {
  let user = await getUserByEmail(req.body.email);
  if (user === null) {
    return false;
  } else {
    let comparePass = await bcrypt.compare(req.body.password, user.password);
    if (comparePass == false) {
      return false;
    } else {
      req.session = user;
      return true;
    }
  }
};

let isLogging = async (req) => {
  if (req.session && req.session.user) {
    return true;
  } else {
    return false;
  }
};
let findItemByName = async (name) => {
  try {
    let item = await db.Item.findAll({
      where: {
        name: name,
      },
      limit: 10,
      offset: 10,
    });
    return item;
  } catch (e) {
    console.log(e);
  }
};
let findItemImage = async (id) => {
  try {
    let itemImage = await db.ItemImage.findAll({
      where: {
        itemId: id,
      },
      limit: 10,
      offset: 10,
    });
    return itemImage;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  createNewUser,
  signIn,
  isLogging,
  getUserByEmail,
  getUserTokenByToken,
  findItemByName,
  findItemImage,
};
