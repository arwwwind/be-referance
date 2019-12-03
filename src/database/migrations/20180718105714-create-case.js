'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Cases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      referralDate: {
        type: Sequelize.DATE
      },
      softDeleteRequested: {
        type: Sequelize.BOOLEAN
      },
      softDeleted: {
        type: Sequelize.BOOLEAN
      },
      cancelReason: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.STRING
      },
      googleDriveID: {
        type: Sequelize.STRING
      },
      caseSettlementAmount: {
        type: Sequelize.FLOAT
      },
      noticeRepFiledServed: {
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
    return queryInterface.dropTable('Cases');
  }
};