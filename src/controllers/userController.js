const db = require('../models/index');
const { Op, } = require('sequelize');
const {sequelize} = require('../config/connectDB');
const sendMail = require('../service/sendMail');
const RESPONSE = require('../schema/response');
const convertBcrypt = require('../service/convertBcrypt');
const token = require('../service/token');
const image = require('../service/image');
const paypal = require('../config/paypal');

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
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
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
    const cart = await db.Cart.findAll({
      where: {
        userId: checkUser.id
      },
      attributes: ['itemId','quantity'],
      raw:true,
    });
    res.cookie('token', newToken);
    res.cookie('cart',JSON.stringify(cart));
    return res.status(200).send(RESPONSE('Đăng nhập thành công', 0, checkUser));
  },
  async logout(req, res) {
    res.clearCookie('token');
    res.clearCookie('cart');
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
    return res.status(200).send(RESPONSE('Thông tin cá nhân', 0, checkUser));
  },
  async searchProduct(req, res) {
    let { name, priceMin, priceMax, page, size } = req.query;
    const options = {};
    page = page ? parseInt(page) : parseInt(process.env.PAGE);
    size = size ? parseInt(size) : parseInt(process.env.SIZE);
    if (name) {
      options.name = {
        [Op.iLike]: `${name}%`,
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
        as: 'itemImageData',
        target: [
          // 'id',
          // 'image'
          // [Sequelize.literal(
          //   `case when id >= 1 then '${req.headers.origin}/public/${image}'`,'image'
          // )]
        ], // lấy ra toàn bộ
      },
    ];
    const totalProduct = await db.Item.count({
      where: options,
      col: 'id'
    })

    const products = await db.Item.findAll({
      where: options,
      offset: (page - 1) * size,
      limit: size,
      include,
    });
    const convertProducts = products.map((item) => {
      const changeImage = (itemValue) => {
        return itemValue.map((image) => {
          return {
            ...image.dataValues,
            image: `${req.headers.host}/public/img/${image.dataValues.image}`
          }
        });
      }
      return {
        ...item.dataValues,
        itemImageData: changeImage(item.dataValues.itemImageData)
      }
    });
    // console.log(convertProducts);
    return res.status(200).send(RESPONSE('danh sách sản phẩm', 0, {
      totalPage: Math.ceil(totalProduct / size),
      products:convertProducts,
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
    const trx = await sequelize.transaction();
    try {
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
    const trx = await sequelize.transaction();
    try {
      const { fullname, phoneNumber, gender, imageAvatar, address } = req.body;
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
  async getCart(req, res) {
    const cart = await db.Cart.findAll({
      where: {
        userId: req.userId
      },
      include: [
        {
          model: db.Item,
          as: 'itemData',
          attributes: ['name','description','price']
        }
      ]
    });
    return res.status(200).send(RESPONSE('giỏ hàng người dùng', 0, cart));
  },
  async orderItems(req, res) {
    const trx = await sequelize.transaction();
    try {
      //promotionId
      /*
       [
        {
          itemId,
          quantity,
        }
       ]
       */
      const { items, isPayment, methodPayment, addressReceive, phoneContact } = req.body;
      const promotion = await db.PromotionItem.findAll({
        where: {
          itemId: {
            [Op.in]: items.map((item)=> item.itemId)
          }
        },
        include: [
          {
            model: db.Promotion,
            as: 'PromotionData',
            attributes: ['reducePercent','dayBegin','dayFinish'],
            where: {
              dayBegin: {
                [Op.lte]: new Date(),
              },
              dayFinish: {
                [Op.gte]: new Date(),
              }
            }
          },
          {
            model: db.Item,
            as: 'itemData',
            attributes: ['price']
          }
        ]
      });
      let newItems = [];
      items.forEach((item) => {
        promotion.forEach((p) => {
          if(promotion.itemId === item.itemId) {
            newItems.push({
              ...item,
              price: promotion.itemData.price * 
              (1 - promotion.PromotionData.reducePercent ? promotion.PromotionData.reducePercent : 0)
            })
          }
        })
      });
      
      const newOrder = await db.Order.create({
        userId: req.userId,
        isPayment,
        methodPayment,
        deliver: 'none',
        addressReceive,
        timeOrder: new Date(),
        phoneContact,
      }, {
        transaction: trx,
      });
      const newArr = newItems.map((itemValue) => {
        return {
          orderId: newOrder.dataValues.id,
          itemId: itemValue.itemId,
          quantity: itemValue.quantity,
          price: itemValue.price,
        }
      });
      await db.OrderItem.bulkCreate(newArr, {
        transaction: trx
      });
      await trx.commit();
      return res.status(200).send(RESPONSE('Đặt đơn thành công', 0));
    } catch (error) {
      await trx.rollback();
      return res.status(200).send(RESPONSE('có lỗi xảy ra', -1));
    }
    // items: [
    //   {
    //     idItem: 1,
    //     quantity: 4,
    //     price: 100000 // đã áp mã giảm giá
    //   },
    //   {
    //     idItem: 2,
    //     quantity:1,
    //   }
    // ]
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
    const trx = await sequelize.transaction();
    try {
      const { itemId, orderId, comment, star, images } = req.body;
      const checkReview = await db.Order.findAll({
        // nest: true,
        where: {
          userId: req.userId,
          id: orderId,
          isPayment: true,
          deliver: 'done',
        },
        include: [
            {
              model: db.OrderItem,
              as: 'orderItemData',
              target: [],
              attributes: ['itemId'],
              where: {
                itemId,
              }
            }
          ]
      });
      if (!checkReview || checkReview.orderItemData?.length === 0) {
        return res.status(200).send(RESPONSE('Bình luận không hợp lệ', -1));
      }
      const options = { text: comment, itemId };
      if (!comment) {
        return res.status(200).send(RESPONSE('Cần có nội dung bình luận', -1));
      }
      if (star) {
        options.star = star;
      }
      
      const idComment = await db.Recomment.create({
        ...options,
        userId: req.userId,
        itemId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { transaction: trx });
      console.log('idcomment: ' + idComment.id);
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
            commentId: idComment.id,
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
      console.log(error);
      return res.status(200).send(RESPONSE('có lỗi xảy ra', -1));
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
      order: [
        ['createdAt','DESC']
      ],
      include: [
        {
          model: db.OrderItem,
          as: 'orderItemData',
          attributes: ['itemId', 'quantity', 'price', 'id'],
          required: false,
          include: [
            {
              model: db.Item,
              as: 'itemData',
              attributes: ['name', 'description', 'id'],
              // required: false,
              //sr evo
              include: [
                {
                  model: db.Shop,
                  as: 'shopData',
                  attributes: ['shopName','status','id'],
                },
                {
                  model: db.ItemImage,
                  as: 'itemImageData',
                  attributes: ['image','id'],
                }
              ]
            },
            
          ]
        },
      ],
    }
    const total = await db.Order.count({
      ...options,
      col: 'id',
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
    const total = await db.FavoriteShop.count({
      col: 'id',
      where: {
        userId: req.userId,
      }
    });
    const favorites = await db.FavoriteShop.findAll({
      where: {
        userId: req.userId,
      },
      limit: size,
      offset: (page - 1) * size,
    });
    return res.status(200).send(RESPONSE('Danh sách khách sạn yêu thích', 0, {
      favorites,
      totalPage: Math.ceil(total / size),
      page,
      size
    }))
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
            model: db.OrderItem,
            as: 'orderItemData',
            attributes: ['quantity', 'itemId'],

            include: [
              {
                model: db.Item,
                as: 'itemData',
                attributes: ['name', 'description'],

                include: [
                  {
                    model: db.ItemImage,
                    as: 'itemImageData',
                    attributes: ['image'],
                  },
                  {
                    model: db.Shop,
                    as: 'shopData',
                    attributes: ['shopName', 'logo']
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
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: [
        {
          model: db.ItemImage,
          as: 'itemImageData',
          attributes: ['image', 'id'],
        },
        {
          model: db.Shop,
          as: 'shopData',
          attributes: ['shopName', 'address']
        }
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
      // nest: true,
      where: {
        id: idShop
      },
      include: [
        {
          model: db.Item,
          as: 'itemsData',
          attributes: ['name', 'price', 'description', 'id'],
          include: [
            {
              model: db.ItemImage,
              as: 'itemImageData',
              attributes: ['image'],
            }
          ]
        },
        {
          model: db.FavoriteShop,
          as: 'favoriteData',
          // where: {
          //   shopId: idShop,
          // },
          attributes: [
            'userId',
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
    const {idReader, text} = req.body;
    await db.Chat.create({
      readerId: idReader,
      writerId: req.userId,
      text,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return res.status(200).send(RESPONSE('chat được lưu', 0));
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
  async paymentByPaypal(req, res) {
    const {items, idOrder} = req.body;
    let totalAmount = 0;
    const fixItem = items.map((value) => {
      totalAmount += (value.price * value.quantity);
      return {
        name: value.name,
        sku: value.id,
        price: value.price,
        currency: 'USD',
        quantity: value.quantity
      }
    });
    const host = req.headers.host.includes('http') ? req.headers.host : `http://${req.headers.host}`;
    const origin = req.headers.origin.include('http') ? req.headers.origin : `https://${req.headers.origin}`;
    const payment_json = {
      intent: 'sale',
      payer: {
        'payment_method': 'paypal'
      },
      'redirect_urls': {
        'return_url': `${origin}/user/payment/success?&idOrder=${idOrder}`,
        'cancel_url': `${origin}/user/payment/cancel`,
      },
      transactions: [
        {
          'item_list': {
            items: fixItem
          },
          amount: {
            currency: 'USD',
            total: totalAmount,
          },
          description: `Mã đơn hàng ${idOrder}`
        }
      ]
    };
    paypal.payment.create(payment_json, async (err, payment) => {
      if (err) {
        return res.status(200).send(RESPONSE('có lỗi xảy ra', -1, err));
      }
      for(let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          if(payment.links[i].href.includes('payment/success')) {
            await db.Order.update({
              isPayment: true,
            }, {
              where: {
                id: idOrder
              }
            });
          }
          return res.redirect(`${payment.links[i].href}`);
        }
      }
    })
  },
  async paymentSuccess(req, res) {
    console.log(req.headers['x-forwarded-proto']);
    const {paymentId, PayerID: payerId,idOrder } = req.query;
    await db.Order.update({
      isPayment: true,
    }, {
      where: {
        id: idOrder
      }
    });
    console.log(idOrder);
    return res.status(200).send(RESPONSE(`Thanh toán đơn hàng thành công`, 0, {
      paymentId,
      payerId,
      idOrder,
    }))
  },
  async paymentCancel(req, res) {
    return res.status(200).send(RESPONSE('Giao dịch bị hủy', 0));
  },
  async checkSuccess(req, res) {
    const {idOrder} = req.query;
    const checkOrder = await db.Order.findOne({
      where: {
        userId: req.userId,
        id: idOrder,
      }
    });
    if (checkOrder.isPayment) {
      return res.status(200).send(RESPONSE('Đơn hàng đã được xác nhận thanh toán', 0));
    }
    return res.status(200),send(RESPONSE('Đơn hàng chưa thanh toán', -1));
  }
};

module.exports = userController;
