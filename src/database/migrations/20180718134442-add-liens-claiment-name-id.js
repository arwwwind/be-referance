'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Liens', 'claimentNameId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('Liens', ['claimentNameId'], {
                type: 'foreign key',
                name: 'fkey_claiment_name_id',
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
        return queryInterface.removeColumn('Liens', 'claimentNameId');
    }
};
