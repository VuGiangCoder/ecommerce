'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
      },
      fullname: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
        },
      },
      position: {
        type: Sequelize.ENUM(['admin', 'seller', 'buyer']),
      },
      phoneNumber: {
        type: Sequelize.STRING,
        validate: {
          isNumeric: true,
        },
      },
      gender: {
        type: Sequelize.ENUM(['male', 'female']),
      },
      imageAvatar: {
        type: Sequelize.STRING,
      },
      limitCreateShop: {
        type: Sequelize.INTEGER,
        validate: {
          min: 0,
        },
      },
      address: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: Sequelize.ENUM(['active', 'non-active']),
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
    await queryInterface.dropTable('Users');
  },
};
