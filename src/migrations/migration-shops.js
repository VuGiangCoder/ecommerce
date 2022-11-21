'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Shops', {
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
        allowNull: false,
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      shopName: {
        type: Sequelize.STRING,
        validate: {
          len: [1, 64],
          notEmpty: true,
        },
      },
      phoneContact: {
        type: Sequelize.STRING,
        validate: {
          isNumeric: true,
          notEmpty: true,
          len: [8, 15],
        },
      },
      status: {
        type: Sequelize.ENUM(['open', 'close']),
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
    await queryInterface.dropTable('Shops');
  },
};
