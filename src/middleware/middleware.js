/* eslint-disable consistent-return */
const RESPONSE = require('../schema/response');
const tokenService = require('../service/token');
const db = require('../models');

const middleware = {
  async verifyToken(req, res, next) {
    const { token } = req.cookies;
    if (!token) {
      return res.status(200).send(RESPONSE('Không có token', -1));
    }
    const payload = tokenService.verifyToken(token);
    if (typeof payload === 'string') {
      return res.status(200).send(RESPONSE('token không hợp lệ', -1));
    }
    const checkToken = await db.StoreToken.findOne({
      where: {
        token,
      },
    });
    if (!checkToken) {
      return res.status(200).send(RESPONSE('token không có trong store', -1));
    }
    req.userEmail = payload.email;
    req.userPosition = payload.position;
    req.userId = payload.id;
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
