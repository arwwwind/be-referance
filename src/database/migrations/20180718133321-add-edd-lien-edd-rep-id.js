'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('EDDLiens', 'eddRepId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('EDDLiens', ['eddRepId'], {
                type: 'foreign key',
                name: 'fkey_edd_rep_id',
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
        return queryInterface.removeColumn('EDDLiens', 'eddRepId');
    }
};
