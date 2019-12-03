'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PartnerServicesNotesPivot', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      partnerServiceId: {
        type: Sequelize.INTEGER,
        references: { model: 'PartnerServices', key: 'id' }
      },
      nodeId: {
        type: Sequelize.INTEGER,
        references: { model: 'Notes', key: 'id' }
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
    return queryInterface.dropTable('PartnerServicesNotesPivot');
  }
};
