'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('InPersonEvents', 'serviceId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('InPersonEvents', ['serviceId'], {
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
        return queryInterface.removeColumn('InPersonEvents', 'serviceId');
    }
};
