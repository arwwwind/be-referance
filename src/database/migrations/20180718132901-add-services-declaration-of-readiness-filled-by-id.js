'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Services', 'declarationOfReadinessFilledById', {
      type: Sequelize.INTEGER
    }).then(() => {
      return queryInterface.addConstraint('Services', ['declarationOfReadinessFilledById'], {
        type: 'foreign key',
        name: 'fkey_declaration_of_readiness_filled_by_id',
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
    return queryInterface.removeColumn('Services', 'declarationOfReadinessFilledById');
  }
};
