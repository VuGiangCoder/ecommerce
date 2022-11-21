'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StoreToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StoreToken.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        as: 'userData',
      });
    }
  }
  StoreToken.init(
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: DataTypes.STRING,
      type: DataTypes.ENUM(['login', 'forget',]),
    },
    {
      sequelize,
      modelName: 'StoreToken',
    },
  );
  return StoreToken;
};
