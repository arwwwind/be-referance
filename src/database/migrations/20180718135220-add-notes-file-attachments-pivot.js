'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('NotesFileAttachmentsPivot', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            noteId: {
                type: Sequelize.INTEGER,
                references: { model: 'Notes', key: 'id' }
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
        return queryInterface.dropTable('NotesFileAttachmentsPivot');
    }
};
