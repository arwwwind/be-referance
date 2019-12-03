'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('InPersonEvents', 'dateTime', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('InPersonEvents', 'rating', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('InPersonEvents', 'ratingReason', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('InPersonEvents', 'repId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('InPersonEvents', ['repId'], {
        type: 'foreign key',
        name: 'fkey_rep_id',
        references: {
          table: 'ContactProfiles',
          field: 'id'
        },
        onUpdate: 'cascade'
      })
    });
    await queryInterface.addColumn('InPersonEvents', 'creatorId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('InPersonEvents', ['creatorId'], {
        type: 'foreign key',
        name: 'fkey_creator_id',
        references: {
          table: 'ContactProfiles',
          field: 'id'
        },
        onUpdate: 'cascade'
      })
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('InPersonEvents', 'dateTime');
    await queryInterface.removeColumn('InPersonEvents', 'rating');
    await queryInterface.removeColumn('InPersonEvents', 'ratingReason');
    await queryInterface.removeColumn('InPersonEvents', 'repId');
    await queryInterface.removeColumn('InPersonEvents', 'creatorId');
  }
};
