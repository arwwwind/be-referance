'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('VenuesEDDRepsPivot', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            venueId: {
                type: Sequelize.INTEGER,
                references: { model: 'Venues', key: 'id' }
            },
            contactId: {
                type: Sequelize.INTEGER,
                references: { model: 'ContactProfiles', key: 'id' }
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
        return queryInterface.dropTable('VenuesEDDRepsPivot');
    }
};
