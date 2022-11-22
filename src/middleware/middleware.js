/* eslint-disable consistent-return */
const RESPONSE = require('../schema/response');
const db = require('../models');
const token = require('../service/token');

const middleware = {
  async refreshToken(req, res, next) {

    next();
  },

  async verifyToken(req, res, next) {
    const { token: tokenValue } = req.cookies;
    console.log('có gọi');
    if (!token) {
      return res.status(200).send(RESPONSE('Không có token', -1));
    }
    const payload = token.verifyToken(tokenValue);
    if (typeof payload !== 'object') {
      return res.status(200).send(RESPONSE('token không hợp lệ', -1));
    }
    const checkToken = await db.StoreToken.findOne({
      where: {
        token: tokenValue,
      },
    });
    if (!checkToken) {
      res.clearCookie('token');
      return res.status(200).send(RESPONSE('token không có trong store', -1));
    }
    req.userEmail = payload.email;
    req.userPosition = payload.position;
    req.userId = payload.id;

    const newToken = token.createToken({
      id: req.userId,
      position: req.userPosition,
      email: req.userEmail,
    })
    await db.StoreToken.update(
      {
        token: newToken,
        updatedAt: new Date(),
      },
      {
        where: {
          userId: req.userId,
        }
      },
    );
    res.cookie('token', newToken);

    next();
  },

  verifyBuyer(req, res, next) {
    if (req.userPosition === 'buyer') next();
    else {
      return res.status(200).send(RESPONSE('Không phải người mua', -1));
    }
  },
};

module.exports = middleware;
