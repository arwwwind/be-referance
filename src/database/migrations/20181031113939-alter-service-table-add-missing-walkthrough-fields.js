'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Services', 'walkthroughClaimNumber', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Services', 'walkthroughAdjNumber', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Services', 'walkthroughInjuryStartDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Services', 'walkthroughClaimNumber');
    await queryInterface.removeColumn('Services', 'walkthroughAdjNumber');
    await queryInterface.removeColumn('Services', 'walkthroughInjuryStartDate');
  }
};
