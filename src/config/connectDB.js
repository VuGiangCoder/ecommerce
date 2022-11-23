const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('railway', 'root', 'CCDxIOIFjySLIvX4WZRk', {
  host: 'containers-us-west-112.railway.app',
  dialect: 'mysql',
  port: 5833,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// module.exports = connectDB;
module.exports = {sequelize, connectDB};
