'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Cases', 'referredClaimOfficeId', {
      type: Sequelize.INTEGER
    }).then(() => {
      return queryInterface.addConstraint('Cases', ['referredClaimOfficeId'], {
        type: 'foreign key',
        name: 'fkey_referred_claim_office_id',
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
    return queryInterface.removeColumn('Cases', 'referredClaimOfficeId');
  }
};
