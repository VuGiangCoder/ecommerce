'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      //   shopId: DataTypes.INTEGER,
      //   description: DataTypes.TEXT,
      //   price: DataTypes.INTEGER,
      //   itemType: DataTypes.STRING,
      //   promation: DataTypes.INTEGER,
      //   quantitiy: DataTypes.INTEGER,
      //   name: DataTypes.STRING,
      shopId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      itemTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      name: {
        type: Sequelize.STRING,
        validate: {
          len: [1, 256],
          notEmpty: true,
          allowNull: false,
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
    await queryInterface.dropTable('Items');
  },
};
