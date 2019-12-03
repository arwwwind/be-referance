'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('TrackEvents', 'parentTrackId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('TrackEvents', ['parentTrackId'], {
                type: 'foreign key',
                name: 'fkey_parent_track_id',
                references: {
                    table: 'Tracks',
                    field: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'cascade'
            })
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('TrackEvents', 'parentTrackId');
    }
};
