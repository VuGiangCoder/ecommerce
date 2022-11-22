'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      // {
      //   email: 'admin@gmail.com',
      //   password: '$2a$10$7BQlgLJMa4mKyyB0AtUyVes5iBmOPLV5EZhLgG9FNgK8Stnj4CBei',
      //   fullname: 'Đỗ Văn Nam',
      //   address: 'Hà Nội',
      //   gender: 'male',
      //   position: 'admin',
      //   phoneNumber: '0339501427',
      //   imageAvatar: '',
      //   limitCreateShop: 0,
      //   status: 'active',
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      {
        email: 'shop1@gmail.com',
        password: '$2a$10$7BQlgLJMa4mKyyB0AtUyVes5iBmOPLV5EZhLgG9FNgK8Stnj4CBei',
        fullname: 'Nguyễn Văn A',
        address: 'Hòa Bình',
        gender: 'female',
        position: 'seller',
        phoneNumber: '0123456789',
        imageAvatar: '',
        limitCreateShop: 3,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'khonghoatay@gmail.com',
        password: '$2a$10$7BQlgLJMa4mKyyB0AtUyVes5iBmOPLV5EZhLgG9FNgK8Stnj4CBei',
        fullname: 'Trần Văn B',
        address: 'Hải Phòng',
        gender: 'female',
        position: 'buyer',
        phoneNumber: '099999988',
        imageAvatar: '',
        limitCreateShop: 0,
        status: 'active',
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