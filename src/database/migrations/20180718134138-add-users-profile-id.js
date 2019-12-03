'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'profileId', {
      type: Sequelize.INTEGER
    }).then(() => {
      return queryInterface.addConstraint('Users', ['profileId'], {
        type: 'foreign key',
        name: 'fkey_profile_id',
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
    return queryInterface.removeColumn('Users', 'profileId');
  }
};
