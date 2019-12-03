'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Liens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      paid: {
        type: Sequelize.BOOLEAN
      },
      settledBeforeLitigation: {
        type: Sequelize.DATE
      },
      resolvedDate: {
        type: Sequelize.DATE
      },
      settlementSummary: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      flagged: {
        type: Sequelize.BOOLEAN
      },
      flagReason: {
        type: Sequelize.STRING
      },
      dateOfServiceStart: {
        type: Sequelize.DATE
      },
      dateOfServiceEnd: {
        type: Sequelize.DATE
      },
      fillingDate: {
        type: Sequelize.DATE
      },
      authority: {
        type: Sequelize.STRING
      },
      paid: {
        type: Sequelize.DATE
      },
      balance: {
        type: Sequelize.FLOAT
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      defenses: {
        type: Sequelize.STRING
      },
      inCourtOutOfCourt: {
        type: Sequelize.BOOLEAN
      },
      deferred: {
        type: Sequelize.STRING
      },
      resolvedByOther: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Liens');
  }
};