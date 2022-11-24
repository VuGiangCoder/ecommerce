"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
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

      Chat.belongsTo(models.User, {
        foreignKey: "readerId",
        targetKey: "id",
        as: "readerData",
      });
      Chat.belongsTo(models.User, {
        foreignKey: "writerId",
        targetKey: "id",
        as: "writerData",
      });
    }
  }
  Chat.init(
    {
      readerId: DataTypes.INTEGER,
      writerId: DataTypes.INTEGER,
      text: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
