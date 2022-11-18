"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notifie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Notifie.belongsTo(models.User, {
      //   foreignKey: "receiverId",
      //   targetKey: "id",
      //   as: "ReceiverId",
      // });
    }
  }
  Notifie.init(
    {
      receiverId: DataTypes.INTEGER,
      senderId: DataTypes.INTEGER,
      text: DataTypes.TEXT,
      createAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Notifie",
    }
  );
  return Notifie;
};
