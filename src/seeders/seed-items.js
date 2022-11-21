'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Items', [
      {
        shopId: 1,
        description: 'thiết bị chuyên dụng',
        price: 100000,
        itemTypeId: 1,
        quantity: 20,
        name: 'Máy sấy tóc',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        shopId: 1,
        description: 'thiết bị thô sơ',
        price: 100000,
        itemTypeId: 1,
        quantity: 10,
        name: 'Bàn là',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};