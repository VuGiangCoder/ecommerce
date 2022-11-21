'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recomment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Recomment.hasMany(models.CommentImage, {
        foreignKey: 'commentId',
        as: 'commentImageData',
      });
    }
  }
  Recomment.init(
    {
      userId: DataTypes.INTEGER,
      itemId: DataTypes.INTEGER,
      text: DataTypes.TEXT,
      star: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Recomment',
    },
  );
  return Recomment;
};
