'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Promotion.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        as: 'userData',
      });
      Promotion.hasMany(models.PromotionItem, {
        foreignKey: 'promotionId',
        as: 'promotionItemData',
      });
    }
  }
  Promotion.init(
    {
      userId: DataTypes.INTEGER,
      reducePercent: DataTypes.INTEGER,
      text: DataTypes.TEXT,
      dayBegin: DataTypes.DATE,
      dayFinish: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Promotion',
    },
  );
  return Promotion;
};
