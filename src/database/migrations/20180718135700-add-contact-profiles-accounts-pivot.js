'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ContactProfilesAccountsPivot', {
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
            organisationId: {
                type: Sequelize.INTEGER,
                references: { model: 'Organisations', key: 'id' }
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
        return queryInterface.dropTable('ContactProfilesAccountsPivot');
    }
};
