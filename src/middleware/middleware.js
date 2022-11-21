/* eslint-disable consistent-return */
const RESPONSE = require('../schema/response');
const tokenService = require('../service/token');
const db = require('../models');
const token = require('../service/token');

const middleware = {
  async refreshToken(req,res) {
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
  },

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
    refreshToken();
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
