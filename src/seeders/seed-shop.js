'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Shops', [
      {
        ownerId: 2,
        shopName: 'Mạnh Nhân - Trung tâm thiết bị di động',
        description: 'Mô tả gian hàng',
        phoneContact: '098889988',
        status: 'open',
        logo: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 2,
        shopName: 'An Cường - Chuyên buôn bán quần áo',
        description: 'Mô tả gian hàng',
        phoneContact: '098889922',
        status: 'open',
        logo: '',
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