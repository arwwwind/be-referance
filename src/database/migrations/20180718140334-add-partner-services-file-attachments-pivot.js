'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PartnerServicesFileAttachmentsPivot', {
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
      fileAttachmentId: {
        type: Sequelize.INTEGER,
        references: { model: 'FileAttachments', key: 'id' }
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
    return queryInterface.dropTable('PartnerServicesFileAttachmentsPivot');
  }
};
