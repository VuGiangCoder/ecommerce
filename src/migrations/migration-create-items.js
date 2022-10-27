"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      //   shopId: DataTypes.INTEGER,
      //   description: DataTypes.TEXT,
      //   price: DataTypes.INTEGER,
      //   itemType: DataTypes.STRING,
      //   promation: DataTypes.INTEGER,
      //   quantitiy: DataTypes.INTEGER,
      //   name: DataTypes.STRING,
      shopId: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      itemType: {
        type: Sequelize.STRING,
      },
      promation: {
        type: Sequelize.INTEGER,
      },
      quantitiy: {
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("items");
  },
};
