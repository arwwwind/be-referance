'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DocumentPreparations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      WCABFilingIncluded: {
        type: Sequelize.BOOLEAN
      },
      draftRequest: {
        type: Sequelize.STRING
      },
      EfileInPerson: {
        type: Sequelize.STRING
      },
      confirmationNumber: {
        type: Sequelize.BOOLEAN
      },
      updateIntervalMonths: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('DocumentPreparations');
  }
};