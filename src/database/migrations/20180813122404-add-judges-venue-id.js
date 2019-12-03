'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Judges', 'venueId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('Judges', ['venueId'], {
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
        return queryInterface.removeColumn('Judges', 'venueId');
    }
};
