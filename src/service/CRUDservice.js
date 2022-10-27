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
let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
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
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createNewUser,
};
