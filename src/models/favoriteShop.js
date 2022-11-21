'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FavoriteShop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    //   FavoriteShop.belongsTo(models.User, {
    //     foreignKey: 'ownerId',
    //     targetKey: 'id',
    //     as: 'userData',
    //   });
    //   FavoriteShop.hasMany(models.Item, {
    //     foreignKey: 'shopId',
    //     as: 'itemsData',
    //   });
    }
  }
  FavoriteShop.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shopId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'FavoriteShop',
    },
  );
  return FavoriteShop;
};
