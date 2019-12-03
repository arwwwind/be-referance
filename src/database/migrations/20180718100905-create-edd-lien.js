'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('EDDLiens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      disputedPeriod: {
        type: Sequelize.RANGE(Sequelize.DATEONLY)
      },
      paymentRate: {
        type: Sequelize.FLOAT
      },
      bodyPartCertified: {
        type: Sequelize.BOOLEAN
      },
      physicianCertified: {
        type: Sequelize.BOOLEAN
      },
      dateOfNoticeToCarrier: {
        type: Sequelize.DATE
      },
      EDDLienAuthority: {
        type: Sequelize.FLOAT
      },
      EDDLienType: {
        type: Sequelize.STRING
      },
      agreeOrDisagree: {
        type: Sequelize.BOOLEAN
      },
      disagreeReason: {
        type: Sequelize.TEXT
      },
      EDDLienOffice: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('EDDLiens');
  }
};