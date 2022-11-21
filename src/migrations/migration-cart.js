/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      //   ownerId: DataTypes.INTEGER,
      //   description: DataTypes.TEXT,
      //   shopName: DataTypes.STRING,
      //   phoneContact: DataTypes.STRING,
      //   status: DataTypes.STRING,
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      itemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        min: 1,
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
  // Sequelize
  async down(queryInterface) {
    await queryInterface.dropTable('Carts');
  },
};
