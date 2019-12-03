'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Services', 'representativeId', {
      type: Sequelize.INTEGER
    }).then(() => {
      return queryInterface.addConstraint('Services', ['representativeId'], {
        type: 'foreign key',
        name: 'fkey_representative_id',
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
    return queryInterface.removeColumn('Services', 'representativeId');
  }
};
