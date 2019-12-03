'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LienServices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      designationDate: {
        type: Sequelize.DATE
      },
      employer: {
        type: Sequelize.STRING
      },
      dateOfDelay: {
        type: Sequelize.DATE
      },
      dateOfDenial: {
        type: Sequelize.DATE
      },
      dateOfMPNNotice: {
        type: Sequelize.DATE
      },
      acceptanceDate: {
        type: Sequelize.DATE
      },
      terminationDate: {
        type: Sequelize.DATE
      },
      denialReason: {
        type: Sequelize.STRING
      },
      primaryTreatingPhysician: {
        type: Sequelize.STRING
      },
      basisOfSettlement: {
        type: Sequelize.TEXT
      },
      QMEorAME: {
        type: Sequelize.STRING
      },
      applicantDepositionDate: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('LienServices');
  }
};