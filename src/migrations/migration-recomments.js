'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recomments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      //   userId: DataTypes.INTEGER,
      //   itemId: DataTypes.INTEGER,
      //   text: DataTypes.TEXT,
      //   star: DataTypes.INTEGER,
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      itemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      text: {
        type: Sequelize.TEXT,
      },
      star: {
        type: Sequelize.INTEGER,
        validate: {
          min: 0,
          max: 5,
        },
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
    await queryInterface.dropTable('Recomments');
  },
};
