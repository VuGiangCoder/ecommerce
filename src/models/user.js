"use strict";
const { Model, Sequelize } = require("sequelize");
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
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.STRING,
        autoIncrement: true,
        primaryKey: true,
        allowNull:false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: [6, 32],
        }
      },
      fullname: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        }
      },
      position: {
        type: DataTypes.ENUM(['admin', 'seller', 'buyer']),
      },
      phoneNumber: {
        type: DataTypes.STRING,
        validate: {
          isNumeric: true
        }
      },
      gender: {
        type: DataTypes.ENUM(['male', 'female']),
      },
      imageAvartar: DataTypes.STRING,
      limitCreateShop: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        }
      },
      address: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        }
      },
      status: {
        type: DataTypes.ENUM(['active','non-active']),
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
