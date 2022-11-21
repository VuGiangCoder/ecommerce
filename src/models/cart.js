'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Cart.belongsTo(models.User, {
      //   foreignKey: 'userId',
      //   targetKey: 'id',
      //   as: 'userData',
      // });

      Cart.belongsTo(models.Item, {
        foreignKey: 'itemId',
        targetKey: 'id',
        as: 'itemData',
      });
    }
  }
  Cart.init(
    {
      userId: DataTypes.INTEGER,
      itemId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Cart',
    },
  );
  return Cart;
};
