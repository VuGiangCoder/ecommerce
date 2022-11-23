'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Item.belongsTo(models.Shop, {
      //   foreignKey: 'shopId',
      //   targetKey: 'id',
      //   as: 'shopData',
      // });
      Item.hasMany(models.ItemImage, {
        foreignKey: 'itemId',
        as: 'itemImageData',
      });
      Item.belongsTo(models.Shop, {
        foreignKey: 'shopId',
        as: 'shopData',
        targetKey: 'id',
      })
    }
  }
  Item.init(
    {
      shopId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      itemTypeId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Item',
    },
  );
  return Item;
};
