'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Cases', 'actualVenueId', {
      type: Sequelize.INTEGER
    }).then(() => {
      return queryInterface.addConstraint('Cases', ['actualVenueId'], {
        type: 'foreign key',
        name: 'fkey_actual_venue_id',
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
    return queryInterface.removeColumn('Cases', 'actualVenueId');
  }
};
