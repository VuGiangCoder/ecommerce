'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
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
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      itemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
        },
      },
      price: {
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
  async down(queryInterface) {
    await queryInterface.dropTable('Orders');
  },
};
