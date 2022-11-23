const db = require('../models/index');
const RESPONSE = require('../schema/response');
const image = require('../service/image');
const {sequelize} = require('../config/connectDB');

const adminController = {
  async getUser(req, res) {
    let {page, size, type} = req.body;
    const options = {};
    page = page ? parseInt(page) : parseInt(process.env.PAGE);
    size = size ? parseInt(size) : parseInt(process.env.SIZE);
    if (type === 'seller' || type === 'buyer' || type === 'admin') {
      options.position = type;
    }
    const total = await db.User.count({
      where: options,
      col: 'id'
    });
    const users = await db.User.findAll({
      where: options,
      limit: size,
      offset: (page - 1) * size
    });
    return res.status(200).send(RESPONSE('Danh sách người dùng', 0, {
      users,
      totalPage: Math.ceil(total / size),
      size,
      page,
    }))
  },
  async updateUser(req, res) {
    const trx = await sequelize.transaction();
    try {
      const {idUser, limitCreateShop, fullname, phoneNumber, gender, address, imageAvatar} = req.body;
      //check limitCreateShop
      const checkUser = await db.User.findOne({
        where: {
          id:idUser
        }
      });
      if (!checkUser) {
        return res.status(200).send(RESPONSE('Người dùng không tồn tại', -1));
      }
      const options = {};
      if(limitCreateShop) {
        options.limitCreateShop = checkUser.position === 'seller' ? limitCreateShop : 0;
      }
      if(fullname) options.fullname = fullname;
      if(phoneNumber) options.phoneNumber = phoneNumber;
      if(gender) options.gender = gender;
      if(address) options.address = address;
      if(imageAvatar) {
        if (!image.isImage(imageAvatar) || image.readSize(imageAvatar) > 2) {
          return res.status(200).send(RESPONSE('File ảnh không hợp lệ'));
        }
        const newImage = image.saveImage(imageAvatar, 'avatar');
        options.imageAvatar = newImage;
      }
      await db.User.update(options, {
        where: {
          id: idUser
        },
        transaction: trx,
      });
      await db.Notifie.create({
        receiverId: idUser,
        senderId: req.userId,
        text: 'Admin đã thay đổi thông tin cá nhân của bạn',
        status: 'unread',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        transaction: trx
      });
      await trx.commit();
      if (imageAvatar) {
        image.deleteImage(checkUser.imageAvatar);
      }
      return res.status(200).send(RESPONSE('Cật nhật thông tin người dùng thành công', 0));
    } catch (error) {
      await trx.rollback();
      return res.status(200).send(RESPONSE('có lỗi xảy ra', -1));
    }
    
  },
  async getOrderOwnUser(req, res) {
    const {idUser} = req.params;
    const result = await db.User.findOne({
      where: {
        id: idUser
      },
      required: false,
      include: [
        {
          model: db.Order,
          as: 'orderData',
          target: ['id', 'isPayment','methodPayment','deliver','timeOrder','addressReceive','phoneContact'],
        }
      ]
    });
    return res.status(200).send(RESPONSE('Danh sách đơn hàng', 0 , result))
  },
  async getDetailOrder(req, res) {
    const {idOrder} = req.params;
    const result = await db.Order.findOne({
      where: {
        id: idOrder,
      },
      include: {
        model: db.OrderItem,
        as: 'orderItemData',
        target: ['itemId','quantity','price']
      }
    });
    return res.status(200).send(RESPONSE('chi tiết đơn hàng', 0, result));
  },
  async notifyToUser(req, res) {
    //send notify to user by position or all
    const {type, content} = req.body;
    const options = {};
    if (type === 'seller' || type === 'buyer' || type === 'admin') {
      options.type = type;
    } else options.type = '';
    const listUser = await db.User.findAll({
      raw: true,
      where: {
        position: {
          [Op.like]: `%${options.type}%`
        },
        id: {
          [Op.not]: req.userId
        }
      }
    });
    const listNotify = listUser.map((user) => {
      return {
        senderId: req.userId,
        receiverId: user.id,
        text: content,
        status: 'unread',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
    await db.Notifie.bulkCreate(listNotify);
    return res.status(200).send(RESPONSE('Gửi thông báo thành công', 0));
  },
  async toggleStatusShop(req, res) {
    const trx = await sequelize.transaction();
    try {
      const {idShop, status} = req.body;
      const checkShop = await db.Shop.findOne({
        where: {
          id: idShop
        }
      });
      if (!checkShop) {
        return res.status(200).send(RESPONSE('gian hàng không tồn tại', -1));
      }
      await db.Shop.update({
        status
      }, {
        where: {
          id: idShop
        },
        transaction: trx,
      });
      await db.Notifie.create({
        receiverId: checkShop.ownerId,
        senderId: req.userId,
        text: `Quản trị viên đã ${status === 'open' ? 'mở' : 'khóa'} gian hàng ${checkShop.name} của bạn`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        transaction: trx
      });
      await trx.commit();
      return res.status(200).send(RESPONSE('Đã cập nhật gian hàng thành công', 0));
    } catch (error) {
      await trx.rollback();
      return res.status(200).send(RESPONSE('có lỗi xảy ra', -1));
    }
  },
}
module.exports = adminController;
