'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Cases', 'assignedVenueId', {
      type: Sequelize.INTEGER
    }).then(() => {
      return queryInterface.addConstraint('Cases', ['assignedVenueId'], {
        type: 'foreign key',
        name: 'fkey_assigned_venue_id',
        references: {
          table: 'Venues',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Cases', 'assignedVenueId');
  }
};
