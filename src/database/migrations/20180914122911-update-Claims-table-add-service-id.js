'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Claims', 'serviceId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => (
      queryInterface.addConstraint('Claims', ['serviceId'], {
        type: 'foreign key',
        name: 'fkey_claim_service_id',
        references: {
          table: 'Services',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    ))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Claims', 'serviceId')
  }
};
