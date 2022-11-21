'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
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
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isPayment: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      methodPayment: {
        type: Sequelize.ENUM(['paypal', 'afterReveice']),
        allowNull: false,
      },
      deliver: {
        type: Sequelize.ENUM(['none','delivering', 'done', 'cancel']),
      },
      timeOrder: {
        type: Sequelize.DATE,
      },
      addressReceive: {
        type: Sequelize.STRING,
        validate: {
          len: [1, 256],
          notEmpty: true,
        },
      },
      phoneContact: {
        type: Sequelize.STRING,
        validate: {
          isNumeric: true,
          notEmpty: true,
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
    await queryInterface.dropTable('Orders');
  },
};
