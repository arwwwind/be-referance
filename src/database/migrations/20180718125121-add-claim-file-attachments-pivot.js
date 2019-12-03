'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ClaimsFileAttachmentsPivot', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      claimId: {
        type: Sequelize.INTEGER,
        references: { model: 'Claims', key: 'id' }
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
    return queryInterface.dropTable('ClaimsFileAttachmentsPivot');
  }
};
