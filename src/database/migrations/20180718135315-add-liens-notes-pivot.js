'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('LiensNotesPivot', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            liensId: {
                type: Sequelize.INTEGER,
                references: { model: 'Liens', key: 'id' },
                onDelete: 'cascade',
                onUpdate: 'cascade'
            },
            noteId: {
                type: Sequelize.INTEGER,
                references: { model: 'Notes', key: 'id' },
                onDelete: 'cascade',
                onUpdate: 'cascade'
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
        return queryInterface.dropTable('LiensNotesPivot');
    }
};
