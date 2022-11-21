'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        as: 'userData',
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'orderItemData',
      })
    }
  }
  Order.init(
    {
      userId: DataTypes.INTEGER,
      isPayment: DataTypes.BOOLEAN,
      methodPayment: DataTypes.ENUM(['paypal', 'afterReveice']),
      deliver: DataTypes.ENUM(['none','delivering', 'done', 'cancel']),
      timeOrder: DataTypes.DATE,
      addressReceive: DataTypes.STRING,
      phoneContact: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Order',
    },
  );
  return Order;
};
