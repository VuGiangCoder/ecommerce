'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User.hasMany(models.Notifie, {
      //   foreignKey: "receiverId",
      //   as: "ReceiverId",
      // });
      User.hasMany(models.Cart, {
        foreignKey: 'userId',
        as: 'cartData',
      });
      User.hasMany(models.Order, {
        foreignKey: 'userId',
        as: 'orderData',
      });
      User.hasMany(models.Promotion, {
        foreignKey: 'userId',
        as: 'promotionData',
      });
      User.hasMany(models.Notifie, {
        foreignKey: 'receiverId',
        as: 'notifyReData',
      });
      User.hasMany(models.Notifie, {
        foreignKey: 'senderId',
        as: 'notifySeData',
      });
      User.hasMany(models.Recomment, {
        foreignKey: 'userId',
        as: 'recommentData',
      });
      User.hasMany(models.Shop, {
        foreignKey: 'ownerId',
        as: 'shopData',
      });
      User.hasOne(models.StoreToken, {
        foreignKey: 'userId',
        as: 'tokenData',
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.STRING,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      fullname: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      position: {
        type: DataTypes.ENUM(['admin', 'seller', 'buyer']),
      },
      phoneNumber: {
        type: DataTypes.STRING,
        validate: {
          isNumeric: true,
        },
      },
      gender: {
        type: DataTypes.ENUM(['male', 'female']),
      },
      imageAvatar: DataTypes.STRING,
      limitCreateShop: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
      },
      address: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.ENUM(['active', 'non-active']),
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
