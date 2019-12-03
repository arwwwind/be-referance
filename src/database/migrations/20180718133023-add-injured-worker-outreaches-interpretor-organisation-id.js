'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn('InjuredWorkerOutreaches', 'interpretorOrganisationId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('InjuredWorkerOutreaches', ['interpretorOrganisationId'], {
                type: 'foreign key',
                name: 'fkey_interpretor_organisation_id',
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
        return queryInterface.removeColumn('InjuredWorkerOutreaches', 'interpretorOrganisationId');
    }
};
