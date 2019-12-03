'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Cases', 'managingAdjustorId', {
      type: Sequelize.INTEGER
    }).then(() => {
      return queryInterface.addConstraint('Cases', ['managingAdjustorId'], {
        type: 'foreign key',
        name: 'fkey_managing_adjustor_id',
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
    return queryInterface.removeColumn('Cases', 'managingAdjustorId');
  }
};
