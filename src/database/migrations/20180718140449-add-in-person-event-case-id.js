'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('InPersonEvents', 'caseId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('InPersonEvents', ['caseId'], {
                type: 'foreign key',
                name: 'fkey_case_id',
                references: {
                    table: 'Cases',
                    field: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'cascade'
            })
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('InPersonEvents', 'caseId');
    }
};
