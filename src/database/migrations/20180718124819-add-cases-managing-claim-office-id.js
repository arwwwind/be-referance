'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Cases', 'managingClaimOfficeId', {
      type: Sequelize.INTEGER
    }).then(() => {
      return queryInterface.addConstraint('Cases', ['managingClaimOfficeId'], {
        type: 'foreign key',
        name: 'fkey_managing_claim_office_id',
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
    return queryInterface.removeColumn('Cases', 'managingClaimOfficeId');
  }
};
