'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ContactProfilesNotesPivot', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            contactId: {
                type: Sequelize.INTEGER,
                references: { model: 'ContactProfiles', key: 'id' }
            },
            noteId: {
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
        return queryInterface.dropTable('ContactProfilesNotesPivot');
    }
};
