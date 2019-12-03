'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tracks', 'preAssignedTo', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => (
      queryInterface.addConstraint('Tracks', ['preAssignedTo'], {
        type: 'foreign key',
        name: 'fkey_pre_assigned_to_id',
        references: {
          table: 'ContactProfiles',
          field: 'id'
        },
        onUpdate: 'cascade'
      })
    ));
    await queryInterface.addColumn('Tracks', 'dueDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Tracks', 'summary', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Tracks', 'priority', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Tracks', 'taskType', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Tracks', 'serviceType', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Tracks', 'phase', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Tracks', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Tracks', 'preAssignedTo').then(() => (
      queryInterface.removeColumn('Tracks', 'dueDate')
    )).then(() => (
      queryInterface.removeColumn('Tracks', 'summary')
    )).then(() => (
      queryInterface.removeColumn('Tracks', 'priority')
    )).then(() => (
      queryInterface.removeColumn('Tracks', 'taskType')
    )).then(() => (
      queryInterface.removeColumn('Tracks', 'serviceType')
    )).then(() => (
      queryInterface.removeColumn('Tracks', 'phase')
    )).then(() => (
      queryInterface.removeColumn('Tracks', 'position')
    ));
  }
};
