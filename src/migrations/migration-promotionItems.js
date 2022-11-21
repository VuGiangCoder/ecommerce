'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PromotionItems', {
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
        allowNull: false,
      },
      promotionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('PromotionItems');
  },
};
