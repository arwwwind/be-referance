'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Services', 'eddLienClaimNumber', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Services', 'eddLienInjuryEndDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Services', 'eddLienInjuryStartDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Services', 'eddLienClaimNumber');
    await queryInterface.removeColumn('Services', 'eddLienInjuryEndDate');
    await queryInterface.removeColumn('Services', 'eddLienInjuryStartDate');
  }
};
