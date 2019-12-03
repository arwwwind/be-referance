'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TrackEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      dueFromCompletionOfPrevious: {
        type: Sequelize.FLOAT
      },
      summary: {
        type: Sequelize.TEXT
      },
      priority: {
        type: Sequelize.STRING
      },
      parentCasePhase: {
        type: Sequelize.STRING
      },
      order: {
        type: Sequelize.FLOAT
      },
      defaultRole: {
        type: Sequelize.STRING
      },
      taskType: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TrackEvents');
  }
};