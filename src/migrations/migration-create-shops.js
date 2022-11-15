"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("shops", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      //   ownerId: DataTypes.INTEGER,
      //   description: DataTypes.TEXT,
      //   shopName: DataTypes.STRING,
      //   phoneContact: DataTypes.STRING,
      //   status: DataTypes.STRING,
      ownerId: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.TEXT,
      },
      shopName: {
        type: Sequelize.STRING,
      },
      phoneContact: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      like: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("shops");
  },
};
