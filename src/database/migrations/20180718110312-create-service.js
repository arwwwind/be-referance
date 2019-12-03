'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serviceStartDate: {
        type: Sequelize.DATE
      },
      settlementAuthority: {
        type: Sequelize.STRING
      },
      cancelReason: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.STRING
      },
      notesToHearingRep: {
        type: Sequelize.TEXT
      },
      suspended: {
        type: Sequelize.BOOLEAN
      },
      permantAndStationeryDate: {
        type: Sequelize.DATE
      },
      billingAmount: {
        type: Sequelize.FLOAT
      },
      invoiceID: {
        type: Sequelize.STRING
      },
      settlementType: {
        type: Sequelize.STRING
      },
      caseSettlementDate: {
        type: Sequelize.DATE
      },
      declarationOfReadinessFilled: {
        type: Sequelize.BOOLEAN
      },
      description: {
        type: Sequelize.TEXT
      },
      primaryTreatingPhysician: {
        type: Sequelize.STRING
      },
      demand: {
        type: Sequelize.STRING
      },
      rushRequested: {
        type: Sequelize.BOOLEAN
      },
      serviceEnd: {
        type: Sequelize.DATE
      },
      IWStillEmployed: {
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
    return queryInterface.dropTable('Services');
  }
};