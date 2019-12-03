'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Organisations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      companyName: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      mainPhone: {
        type: Sequelize.STRING
      },
      fax: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      specialInstructionsNotes: {
        type: Sequelize.TEXT
      },
      accountVerified: {
        type: Sequelize.BOOLEAN
      },
      leinClaimentStayed: {
        type: Sequelize.BOOLEAN
      },
      territory: {
        type: Sequelize.STRING
      },
      settlementLanguage: {
        type: Sequelize.TEXT
      },
      servicesProvided: {
        type: Sequelize.STRING
      },
      physicianOrNonPysician: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('Organisations');
  }
};
