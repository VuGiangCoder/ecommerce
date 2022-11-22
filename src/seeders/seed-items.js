'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Items', [
      {
        shopId: 1,
        description: 'Mô tả sản phẩm',
        price: 8000000,
        itemTypeId: 1,
        quantity: 20,
        name: 'Iphone 8plus',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        shopId: 1,
        description: 'Mô tả sản phẩm',
        price: 10000000,
        itemTypeId: 1,
        quantity: 10,
        name: 'Samsung glaxy s20',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        shopId: 2,
        description: 'Mô tả sản phẩm',
        price: 150000,
        itemTypeId: 2,
        quantity: 40,
        name: 'Áo khoác jeans',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        shopId: 2,
        description: 'Mô tả sản phẩm',
        price: 120000,
        itemTypeId: 2,
        quantity: 60,
        name: 'Quần thể thao',
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