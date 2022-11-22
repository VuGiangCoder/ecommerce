'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ItemImages', [
      {
        itemId: 4,
        image: 'item/iphone8-1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemId: 4,
        image: 'item/iphone8-2.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemId: 4,
        image: 'item/iphone8-3.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemId: 4,
        image: 'item/iphone8-4.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemId: 4,
        image: 'item/iphone8-5.jpg',
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