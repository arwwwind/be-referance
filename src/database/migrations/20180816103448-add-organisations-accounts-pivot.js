'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('OrganisationsAccountsPivot', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            organisationId: {
                type: Sequelize.INTEGER,
                references: { model: 'Organisations', key: 'id' }
            },
            accountId: {
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
        return queryInterface.dropTable('OrganisationsAccountsPivot');
    }
};
