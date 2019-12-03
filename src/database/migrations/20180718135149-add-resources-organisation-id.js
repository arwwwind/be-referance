'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Resources', 'organisationId', {
      type: Sequelize.INTEGER
    }).then(() => {
      return queryInterface.addConstraint('Resources', ['organisationId'], {
        type: 'foreign key',
        name: 'fkey_organisation_id',
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
    return queryInterface.removeColumn('Resources', 'organisationId');
  }
};
