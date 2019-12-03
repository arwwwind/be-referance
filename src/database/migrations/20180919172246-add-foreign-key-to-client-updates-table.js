'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ClientUpdates', 'profileId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('ClientUpdates', ['profileId'], {
        type: 'foreign key',
        name: 'fkey_profile_id',
        references: {
          table: 'ContactProfiles',
          field: 'id'
        },
        onUpdate: 'cascade'
      })
    });
    await queryInterface.addColumn('ClientUpdates', 'serviceId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('ClientUpdates', ['serviceId'], {
        type: 'foreign key',
        name: 'fkey_service_id',
        references: {
          table: 'Services',
          field: 'id'
        },
        onUpdate: 'cascade'
      })
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ClientUpdates', 'profileId');
    await queryInterface.removeColumn('ClientUpdates', 'serviceId');
  }
};
