'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PromotionItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PromotionItem.belongsTo(models.Promotion, {
        foreignKey: 'promotionId',
        targetKey: 'id',
        as: 'promotionData',
      });
      PromotionItem.belongsTo(models.Item, {
        foreignKey: 'itemId',
        targetKey: 'id',
        as: 'itemData',
      });
    }
  }
  PromotionItem.init(
    {
      itemId: DataTypes.INTEGER,
      promotionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'PromotionItem',
    },
  );
  return PromotionItem;
};
