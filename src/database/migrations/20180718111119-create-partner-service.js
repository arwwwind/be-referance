'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PartnerServices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      declineReason: {
        type: Sequelize.STRING
      },
      offerDate: {
        type: Sequelize.DATE
      },
      signDate: {
        type: Sequelize.DATE
      },
      medicalAmount: {
        type: Sequelize.FLOAT
      },
      partnerName: {
        type: Sequelize.STRING
      },
      serviceDescription: {
        type: Sequelize.TEXT
      },
      serviceType: {
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
    return queryInterface.dropTable('PartnerServices');
  }
};