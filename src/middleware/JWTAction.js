require("dotenv").config();
const jwt = require("jsonwebtoken");

let createJWT = (id, email, position) => {
  let token = jwt.sign({ id, email, position }, process.env.JWT_SECRET);
  console.log(token);
  return token;
};
module.exports = {
  createJWT,
};
