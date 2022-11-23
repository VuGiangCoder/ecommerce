/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chats', {
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
      readerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      writerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      text: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: true
        }
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
    await queryInterface.dropTable('Chats');
  },
};
