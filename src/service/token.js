const jwt = require('jsonwebtoken');

const token = {
  createToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET);
  },
  verifyToken(valueToken) {
    return jwt.verify(valueToken, process.env.JWT_SECRET, (err, decode) => {
      if (err) return false;
      return decode;
    });
  },
};

module.exports = token;
