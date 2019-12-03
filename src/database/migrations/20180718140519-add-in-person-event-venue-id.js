'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('InPersonEvents', 'venueId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('InPersonEvents', ['venueId'], {
                type: 'foreign key',
                name: 'fkey_venue_id',
                references: {
                    table: 'Venues',
                    field: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'cascade'
            })
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('InPersonEvents', 'venueId');
    }
};
