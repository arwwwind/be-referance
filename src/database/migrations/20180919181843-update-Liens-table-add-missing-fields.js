'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Liens', 'demand', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Liens', 'requestedStatus', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Liens', 'representedById', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addConstraint('Liens', ['representedById'], {
      type: 'foreign key',
      name: 'fkey_lient_represented_by_id',
      references: {
        table: 'ContactProfiles',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Liens', 'demand');
    await queryInterface.removeColumn('Liens', 'requestedStatus');
    await queryInterface.removeColumn('Liens', 'representedById');
  }
};
