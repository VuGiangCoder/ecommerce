/* eslint-disable consistent-return */
const RESPONSE = require('../schema/response');
const db = require('../models');
const token = require('../service/token');
const {sequelize} = require('../config/connectDB');

const middleware = {
  async verifyToken(req, res, next) {
    const { token: tokenValue } = req.cookies;
    if (!token) {
      return res.status(200).send(RESPONSE('Không có token', -1));
    }
    const payload = token.verifyToken(tokenValue);
    if (typeof payload !== 'object') {
      res.clearCookie('token');
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

  async verifyBuyer(req, res, next) {
    if (req.userPosition === 'buyer') {
      if(req.cookies.cart) {
        let {cart} = req.cookies;
        cart = JSON.parse(cart);
        cart = cart.map((item) => {
          return {
            ...item,
            userId: req.userId,
          }
        })
        const trx = await sequelize.transaction();
        try {
          await db.Cart.destroy({
            where: {
              userId: req.userId,
            },
            transaction: trx,
          });
          await db.Cart.bulkCreate(cart,{
            transaction: trx
          })
          await trx.commit();
        } catch (error) {
          await trx.rollback();
        }
      /*
        cart = [
          {
            itemId: 1,
            quantity: 10,
            id: 1,
          },
          {
            itemId: 3,
            quantity: 20,
          },
        ]
      */
      }
      next();
    }
    else {
      return res.status(200).send(RESPONSE('Không phải người mua', -1));
    }
  },
  verifySeller(req, res, next) {
    if (req.userPosition === 'seller') next();
    else {
      return res.status(200).send(RESPONSE('Không phải người bán', -1));
    }
  },
  verifyAdmin(req, res, next) {
    if (req.userPosition === 'admin') next();
    else {
      return res.status(200).send(RESPONSE('Không phải quản trị viên', -1));
    }
  },
};

module.exports = middleware;
