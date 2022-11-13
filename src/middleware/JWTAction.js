require("dotenv").config();
const jwt = require("jsonwebtoken");

let createJWT = (id, email, position) => {
  let token = jwt.sign({ id, email, position }, process.env.JWT_SECRET, {
    expiresIn: 6000,
  });

  console.log(token);
  return token;
};
module.exports = {
  createJWT,
};
