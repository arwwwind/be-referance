'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('InPersonEvents', 'judgeId', {
            type: Sequelize.INTEGER
        }).then(() => {
            return queryInterface.addConstraint('InPersonEvents', ['judgeId'], {
                type: 'foreign key',
                name: 'fkey_judge_id',
                references: {
                    table: 'Judges',
                    field: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'cascade'
            })
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('InPersonEvents', 'judgeId');
    }
};
