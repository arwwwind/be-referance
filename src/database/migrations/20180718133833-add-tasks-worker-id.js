'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Tasks', 'workerId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('Tasks', ['workerId'], {
                type: 'foreign key',
                name: 'fkey_worker_id',
                references: {
                    table: 'ContactProfiles',
                    field: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'cascade'
            })
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('Tasks', 'workerId');
    }
};
