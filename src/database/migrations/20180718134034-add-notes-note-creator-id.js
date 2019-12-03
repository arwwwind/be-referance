'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Notes', 'noteCreatorId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('Notes', ['noteCreatorId'], {
                type: 'foreign key',
                name: 'fkey_note_creator_id',
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
        return queryInterface.removeColumn('Notes', 'noteCreatorId');
    }
};
