'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Cases', 'caseOwnerId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Cases', ['caseOwnerId'], {
        type: 'foreign key',
        name: 'fkey_case_owner_id',
        references: {
          table: 'ContactProfiles',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });

    await queryInterface.addColumn('Cases', 'referralId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Cases', ['referralId'], {
        type: 'foreign key',
        name: 'fkey_referral_id',
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
    return queryInterface.removeColumn('Cases', 'caseOwnerId').then(() => (
      queryInterface.removeColumn('Cases', 'referralId')
    ));
  }
};
