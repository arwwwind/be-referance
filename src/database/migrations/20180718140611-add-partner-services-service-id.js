'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('PartnerServices', 'serviceId', {
      type: Sequelize.INTEGER
    }).then(() => {
      return queryInterface.addConstraint('PartnerServices', ['serviceId'], {
        type: 'foreign key',
        name: 'fkey_case_id',
        references: {
          table: 'Services',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('PartnerServices', 'serviceId');
  }
};
