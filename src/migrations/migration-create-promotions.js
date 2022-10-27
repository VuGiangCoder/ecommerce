"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("promotions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      //   itemId: DataTypes.INTEGER,
      //   reducePercent: DataTypes.INTEGER,
      //   text: DataTypes.TEXT,
      //   dayBegin: DataTypes.DATE,
      //   dayFinish: DataTypes.DATE,
      itemId: {
        type: Sequelize.INTEGER,
      },
      reducePercent: {
        type: Sequelize.INTEGER,
      },
      text: {
        type: Sequelize.TEXT,
      },
      dayBegin: {
        type: Sequelize.DATE,
      },
      dayFinish: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("promotions");
  },
};
