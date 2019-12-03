'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
      },
      googleEmailLogin: {
          type: Sequelize.STRING,
          unique: true
      },
      userImage: {
          type: Sequelize.STRING
      },
      userType: {
          type: Sequelize.STRING
      },
      active: {
          type: Sequelize.BOOLEAN
      },
      lastLogin: {
          type: Sequelize.DATE
      },
      lastPasswordReset: {
          type: Sequelize.DATE
      },
      password: {
          type: Sequelize.STRING
      },
      manager: {
          type: Sequelize.BOOLEAN
      },
      loginEmail: {
          type: Sequelize.STRING,
          unique: true
      },
      createdAt: {
        allowNull: false,
          type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
          type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};