'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shop.belongsTo(models.User, {
        foreignKey: 'ownerId',
        targetKey: 'id',
        as: 'userData',
      });
      Shop.hasMany(models.Item, {
        foreignKey: 'shopId',
        as: 'itemsData',
      });
      Shop.hasMany(models.FavoriteShop, {
        foreignKey: 'shopId',
        as: 'favoriteData',
      })
    }
  }
  Shop.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      shopName: {
        type: DataTypes.STRING,
        validate: {
          len: [1, 64],
          notEmpty: true,
        },
      },
      phoneContact: {
        type: DataTypes.STRING,
        validate: {
          isNumeric: true,
          notEmpty: true,
          len: [8, 15],
        },
      },
      status: DataTypes.ENUM(['open', 'close']),
      // like: {
      //   type: DataTypes.INTEGER,
      //   validate: {
      //     min: 0,
      //   },
      // },
    },
    {
      sequelize,
      modelName: 'Shop',
    },
  );
  return Shop;
};
