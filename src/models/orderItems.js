'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    //   OrderItem.belongsTo(models.User, {
    //     foreignKey: 'userId',
    //     targetKey: 'id',
    //     as: 'userData',
    //   });
      OrderItem.belongsTo(models.Item, {
        foreignKey: 'itemId',
        targetKey: 'id',
        as: 'itemData',
      });
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'orderId',
        targetKey: 'id',
        as: 'orderData',
      });
    }
  }
  OrderItem.init(
    {
      orderId: DataTypes.INTEGER,  
      itemId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OrderItem',
    },
  );
  return OrderItem;
};
