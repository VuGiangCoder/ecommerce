'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Promotions', {
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
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reducePercent: {
        type: Sequelize.INTEGER,
        validate: {
          min: 0,
          max: 1,
        },
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
  async down(queryInterface) {
    await queryInterface.dropTable('Promotions');
  },
};
