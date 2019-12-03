'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Cases', 'referredByAdjustorId', {
      type: Sequelize.INTEGER
    }).then(() => {
      return queryInterface.addConstraint('Cases', ['referredByAdjustorId'], {
        type: 'foreign key',
        name: 'fkey_referred_by_adjustor_id',
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
    return queryInterface.removeColumn('Cases', 'referredByAdjustorId');
  }
};
