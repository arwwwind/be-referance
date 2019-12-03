'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Resources', 'workerId', {
      type: Sequelize.INTEGER
    }).then(() => {
      return queryInterface.addConstraint('Resources', ['workerId'], {
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
    return queryInterface.removeColumn('Resources', 'workerId');
  }
};
