const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const db = require("../models/index");

let hashUSerPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};
let findUser = async (body) => {
  return await User.findOne({
    where: {
      email: body.email,
    },
  });
};

let createNewUser = async (data) => {
  let user = await findUser(data);
  if (user == null) {
    let hashPasswordFromBcrypt = await hashUSerPassword(data.password);
    await db.User.create({
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
    });
    return true;
  } else {
    return false;
  }
};
let signIn = async (req) => {
  let user = await findUser(req.body);
  if (user === null) {
    return false;
  } else {
    let comparePass = await bcrypt.compare(req.body.password, user.password);
    if (comparePass === false) {
      return false;
    } else {
      req.session.user = user;
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
module.exports = {
  createNewUser,
  signIn,
  isLogging,
};
