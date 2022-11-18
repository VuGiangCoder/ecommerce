"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        email: "admin@gmail.com",
        password: "123456",
        fullname: "Đỗ Văn Nam",
        address: "Hà Nội",
        gender: 'male',
        position: "admin",
        phoneNumber: "0339501427",
        imageAvatar: "",
        limitCreateShop: 0,
        status: "active",
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