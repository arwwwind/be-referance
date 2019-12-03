'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Venues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      abbreviation: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },
      boardNotes: {
        type: Sequelize.STRING
      },
      walkThroughSchedule: {
        type: Sequelize.STRING
      },
      sameDayAdj: {
        type: Sequelize.BOOLEAN
      },
      canWeSelectJudge: {
        type: Sequelize.BOOLEAN
      },
      approvalRating: {
        type: Sequelize.FLOAT
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
    return queryInterface.dropTable('Venues');
  }
};