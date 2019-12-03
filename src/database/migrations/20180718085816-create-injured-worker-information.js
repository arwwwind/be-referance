'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('InjuredWorkerInformations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      medicalReleaseObtained: {
        type: Sequelize.BOOLEAN
      },
      juvoChecklistSigned: {
        type: Sequelize.BOOLEAN
      },
      IWhasPacket: {
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
    return queryInterface.dropTable('InjuredWorkerInformations');
  }
};