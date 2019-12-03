'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('InPersonEvents', 'resourceId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('InPersonEvents', ['resourceId'], {
                type: 'foreign key',
                name: 'fkey_resource_id',
                references: {
                    table: 'Resources',
                    field: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'cascade'
            })
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('InPersonEvents', 'resourceId');
    }
};
