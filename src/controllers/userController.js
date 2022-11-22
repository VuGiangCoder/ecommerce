const db = require('../models/index');
const { Op, Transaction } = require('sequelize');
const sendMail = require('../service/sendMail');
const RESPONSE = require('../schema/response');
const convertBcrypt = require('../service/convertBcrypt');
// const serviceImage = require('../service/serviceImage');
const token = require('../service/token');
const image = require('../service/image');

const userController = {
  async createUser(req, res) {
    // status = non-active
    const {
      email, password, fullname, position,
      phoneNumber, gender, address,
    } = req.body;
    const checkUser = await db.User.findOne({
      where: { email },
    });
    if (checkUser && checkUser.status === 'active') {
      return res.status(200).send(RESPONSE('Email đã được sử dụng', 0));
    }

    const objInsert = {
      email,
      password: convertBcrypt.hash(password),
      fullname,
      position: ['admin', 'buyer', 'seller'].includes(position) ? position : 'buyer',
      phoneNumber,
      gender: ['male', 'female'].includes(gender) ? gender : 'male',
      limitCreateShop: 0,
      address,
      status: 'non-active',
    };
    let idUser;
    if (checkUser && checkUser.status === 'non-active') {
      checkUser.set({
        ...objInsert,
      });
      await checkUser.save();
      idUser = checkUser.id;
    } else idUser = await db.User.create(objInsert);
    const code = token.createToken({ email });
    if (checkUser && checkUser.status === 'non-active') {
      await db.StoreToken.update({ token: code }, {
        where: { userId: checkUser.id },
      });
    } else {
      await db.StoreToken.create({
        userId: idUser,
        token: code,
        type: 'login',
      });
    }

    sendMail(email, 'Xác thực đăng ký', '', `<a href='${req.headers.origin}/confirm_regis?email=${email}&code=${code}'>Tại đây</a>`);

    return res.status(200).send(RESPONSE('Xác nhận đăng ký trong email', 0));
  },
  async login(req, res) {
    const { email, password } = req.body;
    const checkUser = await db.User.findOne({
      // raw: true,
      // nest: true,
      where: { email },
      include: [
        {
          model: db.Cart,
          as: 'cartData',
          attributes: ['itemId', 'quantity'],
        },
        {
          model: db.Notifie,
          as: 'notifyReData',
          attributes: ['text', 'createdAt'],
        },
      ],
    });
    if (!checkUser) {
      return res.status(200).send(RESPONSE('Thông tin không chính xác', -1));
    }
    if (checkUser.dataValues.status !== 'active') {
      return res.status(200).send(RESPONSE('Email chưa được kích hoạt', -1));
    }
    const checkPassword = convertBcrypt.compare(password, checkUser.dataValues.password);
    if (!checkPassword) {
      return res.status(200).send(RESPONSE('Thông tin không chính xác', -1));
    }
    const newToken = token.createToken({
      id: checkUser.id,
      email: checkUser.email,
      position: checkUser.position,
    });
    const checkStoreToken = await db.StoreToken.findOne({
      where: {
        userId: checkUser.dataValues.id,
        type: 'login',
      },
    });
    if (!checkStoreToken) {
      await db.StoreToken.create({
        userId: checkUser.id,
        token: newToken,
        type: 'login',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      checkStoreToken.token = newToken;
      checkStoreToken.updatedAt = new Date();
      await checkStoreToken.save();
    }
    delete checkUser.dataValues.password;
    console.log(newToken);
    res.cookie('token', newToken);
    return res.status(200).send(RESPONSE('Đăng nhập thành công', 0, checkUser));
  },
  async logout(req, res) {
    res.clearCookie('token');
    return res.status(200).send(RESPONSE('đăng xuất thành công', 0));
  },
  async getInfo(req, res) {
    const checkUser = await db.User.findOne({
      where: {
        email: req.userEmail,
      },
      include: [
        {
          model: db.Cart,
          as: 'cartData',
          attributes: ['itemId', 'quantity'],
        },
        {
          model: db.Notifie,
          as: 'notifyReData',
          attributes: ['text', 'createdAt'],
        },
      ],
    });
    if (!checkUser) {
      return res.status(200).send(RESPONSE('Token không hợp lệ', -1));
    }
    delete checkUser.dataValues.password;
    return res.status(200).send(RESPONSE('Thông tin cá nhân', 0, checkUser.dataValues));
  },
  async searchProduct(req, res) {
    let { name, priceMin, priceMax, page, size } = req.query;
    const options = {};
    page = page ? parseInt(page) : parseInt(process.env.PAGE);
    size = size ? parseInt(size) : parseInt(process.env.SIZE);
    if (name) {
      options.name = {
        [Op.iLike]: `%${name}%`,
      }
    }
    if (priceMin) {
      options.price = {
        [Op.gte]: parseInt(priceMin),
      }
    }
    if (priceMax) {
      options.price = {
        [Op.lte]: parseInt(priceMax),
      }
    }

    const include = [
      {
        model: db.ItemImage,
        as: 'itemData',
        attributes: ['image'],
      },
    ];
    const totalProduct = await db.Item.count({
      where: options,
      include,
      col: 'id'
    })

    const products = await db.Item.findAll({
      where: options,
      offset: (page - 1) * size,
      limit: size,
      include
    });
    return res.status(200).send(RESPONSE('danh sách sản phẩm', 0, {
      totalPage: Math.ceil(totalProduct / size),
      products,
      page,
      size,
    }))
  },
  async changePassword(req, res) {
    const { password, newPassword } = req.body;
    const checkUser = await db.User.findOne({
      where: {
        email: req.userEmail,
      },
      raw: true,
    });
    const checkPassword = convertBcrypt.compare(password, checkUser.password);
    if (!checkPassword) {
      return res.status(200).send(RESPONSE('Mật khẩu hiện tại không chính xác', -1));
    }
    const hashNewPassword = convertBcrypt.hash(newPassword);
    checkUser.password = hashNewPassword;
    await checkUser.save();
    return res.status(200).send(RESPONSE('Đổi mật khẩu thành công', 0));
  },
  async forgetPassword(req, res) {
    const token = token.createToken({
      email: req.userEmail,
      id: req.userId,
      position: req.userPosition,
    });
    const checkTokenForget = await db.StoreToken.findOne({
      where: {
        userId: req.userId,
        type: 'forget'
      },
      raw: true,
    });

    if (!checkTokenForget) {
      await db.StoreToken.create({
        userId: req.userId,
        token,
        type: 'forget'
      });
    } else {
      checkTokenForget.token = token;
      await checkTokenForget.save();
    }

    sendMail(req.userEmail, 'Xác nhận quên mật khẩu', '', `<a href='${req.headers.origin}/confirm_passowrd?email=${req.userEmail}&code=${token}'>Tại đây</a>`);
    return res.status(200).send(RESPONSE('Xác nhận trong email', 0));
  },
  async confirmPassword(req, res) {
    try {
      const trx = new Transaction();
      const { email, code } = req.query;
      const { newPassword } = req.body;
      const payload = token.verifyToken(code);
      if (!payload || (payload.email !== email)) {
        return res.status(200).send(RESPONSE('Thông tin không hợp lệ', 0));
      }
      const checkToken = await db.StoreToken({
        where: {
          token: code,
          userId: payload.id,
        }
      });
      if (!checkToken) return res.status(200).send(RESPONSE('Thông tin không hợp lệ', 0));
      const hashNewPassword = convertBcrypt.hash(newPassword);
      await db.User.update({ password: hashNewPassword }, {
        where: {
          id: payload.id,
        },
        transaction: trx,
      });
      await db.StoreToken.destroy({
        where: {
          userId: payload.id,
          token: code,
          type: 'forget',
        },
        transaction: trx,
      });
      await trx.commit();
      return res.status(200).send(RESPONSE('Khôi phục mật khẩu thành công', 0));
    } catch (error) {
      await trx.rollback();
      return res.status(200).send(RESPONSE('có lỗi xảy ra', -1, error));
    }

  },
  async updateUser(req, res) {
    try {
      const { fullname, phoneNumber, gender, imageAvatar, address } = req.body;
      const trx = new Transaction();
      const checkUser = await db.User.findOne({
        where: {
          id: req.userId
        },
        raw: true,
      });
      let currentAvatar = checkUser.imageAvatar;
      if (fullname) checkUser.fullname = fullname;
      if (phoneNumber) checkUser.phoneNumber = phoneNumber;
      if (gender) checkUser.gender = gender;
      if (address) checkUser.address = address;
      if (imageAvatar) {
        if (!image.isImage(imageAvatar)) {
          return res.status(200).send(RESPONSE('File không hợp lệ', -1));
        }
        if (image.readSize(imageAvatar) > 2) {
          return res.status(200).send(RESPONSE('Kích thước file <= 2M', -1));
        }
        const fileName = image.saveImage(imageAvatar, 'avatar');
        checkUser.imageAvatar = fileName;
      }
      await checkUser.save({ transaction: trx });
      await trx.commit();
      image.deleteImage(currentAvatar);
      return res.status(200).send(RESPONSE('Cập nhật thông tin thành công', 0, {
        fullname,
        phoneNumber,
        gender,
        address,
        imageAvatar: `${req.headers.host}/public/${checkUser.imageAvatar}`,
      }));
    } catch (error) {
      await trx.rollback();
      return res.status(200).send(RESPONSE('Có lỗi xảy ra', -1));
    }
  },
  async changeItemOnCart(req, res) {
    try {
      const trx = new Transaction();
      const { cart } = req.cookies;
      const checkCartUser = await db.Cart.finAll({
        raw: true,
        where: {
          userId: req.userId,
        }
      });
      const listIdItem = checkCartUser.map((check) => {
        return check.itemId;
      });
      const arr = cart.map((itemInCart) => {
        if (listIdItem.includes(itemInCart.itemId)) {
          db.Cart.update({
            quantity: itemInCart.quantity ? itemInCart.quantity : 1,
            updatedAt: new Date(),
          }, {
            where: {
              itemId: itemInCart.itemId
            },
            transaction: trx
          })
        } else {
          db.Cart.create({
            itemId: itemInCart.itemId,
            quantity: itemInCart.quantity ? itemInCart.quantity : 1,
            userId: req.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          }, {
            transaction: trx
          });
        }
      });
      await Promise.all(arr);
      await trx.commit();
      return res.status(200).send(RESPONSE('Cập nhật đơn hàng thành công', 0));
    } catch (error) {
      await trx.rollback();
      return res.status(200).send(RESPONSE('có lỗi xảy ra', -1));
    }
    /*
      cart = [
        {
          idItem: 1,
          quantity: 10,
          id: 1,
        },
        {
          idItem: 3,
          quantity: 20,
        },
      ]
    */
  },
  async orderItems(req, res) {
    // items: [
    //   {
    //     idItem: 1,
    //     quantity: 4,
    //   },
    //   {
    //     idItem: 2,
    //     quantity:1,
    //   }
    // ]
    const { items } = req.body;


  },
  async cancelItems(req, res) {
    const { idOrder } = req.params;
    const checkOrderOwn = await db.Order.findOne({
      where: {
        id: idOrder,
        userId: req.userId,
        deliver: 'none'
      }
    });
    if (!checkOrderOwn) {
      return res.status(RESPONSE('Không thể hủy đơn hàng này', -1));
    }
    checkOrderOwn.deliver = 'cancel';
    await checkOrderOwn.save();
    return res.status(200).send(RESPONSE('Hủy đơn hàng thành công', 0));
  },
  //chỉ review được sản phẩm theo đơn hàng đã mua
  async reviewItem(req, res) {
    try {
      const trx = new Transaction();
      const { itemId, orderId, comment, star, images } = req.body;
      const checkReview = await db.Order.findOne({
        nest: true,
        where: {
          userId: req.userId,
          id: orderId,
          include: [
            {
              model: db.OrderItem,
              as: 'orderItemData',
              target: ['itemId'],
              where: {
                itemId
              }
            }
          ]
        }
      });
      if (!checkReview || checkReview.orderItemData.length === 0) {
        return res.status(200).send(RESPONSE('Bình luận không hợp lệ', -1));
      }
      const options = { text: comment, itemId };
      if (!comment) {
        return res.status(200).send(RESPONSE('Cần có nội dung bình luận', -1));
      }
      if (star) {
        comment.star = star;
      }
      const idComment = await db.Recomment.create({
        ...options,
        userId: req.userId,
        itemId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { transaction: trx });
      if (images) {
        images.forEach((imageItem) => {
          if (!image.isImage(imageItem) || image.readSize(imageItem) > 2) {
            return res.status(200).send(RESPONSE('File ảnh không hợp lệ', -1));
          }
        });
        const storeImages = images.map((imageItem) => {
          return image.saveImage(imageItem, 'comment');
        });
        await db.CommentImage.bulkCreate(
          storeImages.map((imageValue) => ({
            commentId: idComment,
            image: imageValue,
            createdAt: new Date(),
            updatedAt: new Date(),
          })), { transaction: trx }
        )
      }
      await trx.commit();
      return res.status(200).send(RESPONSE('bình luận sản phẩm thành công', 0));
    } catch (error) {
      await trx.rollback();
      return res.stat(200).send(RESPONSE('có lỗi xảy ra', -1));
    }
  },
  // async changeReviewItem(req, res) {

  // },
  async getHistoryOrder(req, res) {
    let { page, size } = req.query;
    page = page ? parseInt(page) : parseInt(process.env.PAGE);
    size = size ? parseInt(size) : parseInt(process.env.SIZE);
    const options = {
      where: {
        userId: req.userId
      },
      nest: true,
      include: [
        {
          model: db.OrderItem,
          as: 'orderItemData',
          target: ['itemId', 'quantity', 'price', 'id'],
          required: false,
          include: [
            {
              model: db.Item,
              as: 'itemData',
              target: ['name', 'description', 'id'],
              required: false,
              include: [
                {
                  model: db.Shop,
                  as: 'shopData',
                  target: ['shopName'],
                },
                {
                  model: db.ItemImage,
                  as: 'itemImageData',
                  target: ['image']
                }
              ]
            }
          ]
        },
        {

        }
      ],
    }
    const total = await db.Order.count({
      ...options,
      col: id,
    });
    const orders = await db.Order.findAll({
      ...options,
      limit: size,
      offset: (page - 1) * size
    });
    return res.status(200).send(RESPONSE('Danh sách đơn hàng đã đặt', 0, {
      orders,
      totalPage: Math.ceil(total / size),
      page,
      size
    }))
  },
  async getListShopFavorite(req, res) {
    let { page, size } = req.query;
    page = page ? parseInt(page) : parseInt(process.env.PAGE);
    size = size ? parseInt(size) : parseInt(process.env.SIZE);
    const favorites = await db.FavoriteShop.findAll({
      where: {
        userId: req.userId,
      },
      limit: size,
      offset: (page - 1) * size,
    });
    return res.status(200).send(RESPONSE('Danh sách khách sạn yêu thích', 0, favorites))
  },
  async toggleFavoriteShop(req, res) {
    const { idShop } = req.params;
    const options = {
      shopId: idShop,
      userId: req.userId,
    }
    const checkFavoriteShop = await db.FavoriteShop.findOne({
      where: options
    });
    if (checkFavoriteShop) {
      await db.FavoriteShop.destroy({
        where: options,
      });
    } else {
      await db.FavoriteShop.create(options);
    }
    return res.status(200).send(RESPONSE('Thay đổi trạng thái yêu thích shop thành công', 0));
  },
  async getDetailOrder(req, res) {
    const { idOrder } = req.params;
    const order = await db.Order.findOne({
      nest: true,
      where: {
        id: idOrder,
        include: [
          {
            required: false,
            model: db.OrderItem,
            as: 'orderItemData',
            target: ['quantity', 'itemId'],
            include: [
              {
                model: db.Item,
                as: 'itemData',
                target: ['name', 'description'],
                required: false,

                include: [
                  {
                    model: db.ItemImage,
                    as: 'itemImageData',
                    target: ['image'],
                  },
                  {
                    model: db.Shop,
                    as: 'shopData',
                    target: ['shopName', 'logo']
                  }
                ]
              }
            ]
          }
        ]
      }
    });
    if (!order) {
      return res.status(200).send(RESPONSE('Thông tin không tồn tại', -1));
    }
    return res.status(200).send(RESPONSE('Chi tiết đơn hàng', 0, order));
  },
  async getDetailItem(req, res) {
    const { idItem } = req.params;
    const item = await db.Item.findOne({
      nest: true,
      where: {
        id: idItem,
      },
      include: [
        {
          model: db.ItemImage,
          as: 'itemImageData',
          target: ['image'],
        },
      ]
    });
    if (!item) {
      return res.status(200).send(RESPONSE('Thông tin không chính xác', -1));
    }
    return res.status(200).send(RESPONSE('chi tiết sản phẩm', 0, item))
  },
  async getDetailShop(req, res) {
    const { idShop } = req.params;
    let { page, size } = req.query;
    page = page ? parseInt(page) : parseInt(process.env.PAGE);
    size = size ? parseInt(size) : parseInt(process.env.SIZE);
    const options = {
      nest: true,
      where: {
        id: idShop
      },
      include: [
        {
          model: db.Item,
          as: 'itemData',
          target: ['name', 'price', 'description', 'id'],
          required: false,
          include: [
            {
              model: db.ItemImage,
              as: 'itemImageData',
              target: ['image'],
            }
          ]
        }
      ]
    }
    const total = await db.Shop.count({
      ...options
    });
    const shop = await db.Shop.findOne({
      ...options,
      limit: size,
      offset: (page - 1) * size,
    });
    if (total === 0 || !shop) {
      return res.status(200).send(RESPONSE('Không có thông tin hiển thị', -1));
    }
    return res.status(200).send(RESPONSE('Chi tiết cửa hàng', 0, {
      shop,
      totalPage: Math.ceil(total / size),
      page,
      size,
    }))
  },
  async chat(req, res) {

  },
  async updateNotify(req, res) {
    const { idNotify } = req.params;
    await db.Notifie.update({
      status: 'read',
    }, {
      where: {
        id: idNotify,
      }
    });
    return res.status(200).send(RESPONSE('Update thông báo thành công', 0));
  },
};

module.exports = userController;
