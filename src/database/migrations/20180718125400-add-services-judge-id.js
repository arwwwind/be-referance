'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Services', 'judgeId', {
      type: Sequelize.INTEGER
    }).then(() => {
      return queryInterface.addConstraint('Services', ['judgeId'], {
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
    return queryInterface.removeColumn('Services', 'judgeId');
  }
};
