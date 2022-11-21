'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StoreTokens', {
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
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.ENUM(['login', 'forget']),
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
    await queryInterface.dropTable('StoreTokens');
  },
};
