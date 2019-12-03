'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Services', 'holdReason', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Services', 'suspendReason', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Services', 'holdReason');
    await queryInterface.removeColumn('Services', 'suspendReason');
  }
};
