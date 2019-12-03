'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Cases', 'accountId', {
      type: Sequelize.INTEGER
    }).then(() => {
      return queryInterface.addConstraint('Cases', ['accountId'], {
        type: 'foreign key',
        name: 'fkey_account_id',
        references: {
          table: 'Organisations',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Cases', 'accountId');
  }
};
