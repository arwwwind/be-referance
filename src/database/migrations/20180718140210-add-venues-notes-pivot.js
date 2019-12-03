'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('VenuesNotesPivot', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            venueId: {
                type: Sequelize.INTEGER,
                references: { model: 'Venues', key: 'id' },
                onDelete: 'cascade',
                onUpdate: 'cascade'
            },
            nodeId: {
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
        return queryInterface.dropTable('VenuesNotesPivot');
    }
};
