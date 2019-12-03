'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn('InjuredWorkerOutreaches', 'lawyerOrganisationId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('InjuredWorkerOutreaches', ['lawyerOrganisationId'], {
                type: 'foreign key',
                name: 'fkey_lawyer_organisation_id',
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
        return queryInterface.removeColumn('InjuredWorkerOutreaches', 'lawyerOrganisationId');
    }
};
