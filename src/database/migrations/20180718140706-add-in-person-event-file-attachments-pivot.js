'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('InPersonEventsFileAttachmentsPivot', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            inPersonEventId: {
                type: Sequelize.INTEGER,
                references: { model: 'InPersonEvents', key: 'id' }
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
        return queryInterface.dropTable('InPersonEventsFileAttachmentsPivot');
    }
};
