"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // email: DataTypes.STRING,
      // password: DataTypes.STRING,
      // fullname: DataTypes.STRING,
      // position: DataTypes.STRING,
      // phoneNumber: DataTypes.STRING,
      // gender: DataTypes.BOOLEAN,
      // imageAvartar: DataTypes.STRING,
      // limitCreateShop: DataTypes.INTEGER,
      // address: DataTypes.STRING,
      // status: DataTypes.STRING,
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      fullname: {
        type: Sequelize.STRING,
      },
      position: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      imageAvartar: {
        type: Sequelize.STRING,
      },
      limitCreateShop: {
        type: Sequelize.INTEGER,
      },
      address: {
        type: Sequelize.STRING,
      },
      status: {
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
    await queryInterface.dropTable("users");
  },
};
