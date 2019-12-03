'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Liens', 'serviceId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('Liens', ['serviceId'], {
                type: 'foreign key',
                name: 'fkey_service_id',
                references: {
                    table: 'Services',
                    field: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'cascade'
            })
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('Liens', 'serviceId');
    }
};
