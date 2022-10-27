"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      //   shopId: DataTypes.INTEGER,
      //   userId: DataTypes.INTEGER,
      //   itemId: DataTypes.INTEGER,
      //   : DataTypes.INTEGER,
      //   status: DataTypes.STRING,
      //   timeOder: DataTypes.DATE,
      //   paymentMethod: DataTypes.STRING,
      //   addressReceive: DataTypes.STRING,
      //   phoneContact: DataTypes.STRING,
      //   createAt: DataTypes.DATE,
      shopId: {
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      itemId: {
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      timeOder: {
        type: Sequelize.DATE,
      },
      paymentMethod: {
        type: Sequelize.STRING,
      },
      addressReceive: {
        type: Sequelize.STRING,
      },
      phoneContact: {
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
    await queryInterface.dropTable("orders");
  },
};
