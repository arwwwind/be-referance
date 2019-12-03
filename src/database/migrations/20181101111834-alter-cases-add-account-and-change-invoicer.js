'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Services', 'invoicerId');
    await queryInterface.addColumn('Services', 'invoicerId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addConstraint('Services', ['invoicerId'], {
      type: 'foreign key',
      name: 'fkey_invoicer_id',
      references: {
        table: 'ContactProfiles',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Services', 'invoicerId');
    await queryInterface.addColumn('Services', 'invoicerId', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addConstraint('Services', ['invoicerId'], {
      type: 'foreign key',
      name: 'fkey_invoicer_id',
      references: {
        table: 'Organisations',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  }
};
