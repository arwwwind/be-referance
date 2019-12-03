'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('ContactProfiles', 'organisationId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('ContactProfiles', ['organisationId'], {
                type: 'foreign key',
                name: 'fkey_organisation_id',
                references: {
                    table: 'Organisations',
                    field: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'cascade'
            })
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('ContactProfiles', 'organisationId');
    }
};
