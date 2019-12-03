'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('InjuredWorkerOutreaches', 'authority');
    await queryInterface.addColumn('InjuredWorkerOutreaches', 'authority', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Services', 'step', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('InjuredWorkerOutreaches', 'authority');
    await queryInterface.addColumn('InjuredWorkerOutreaches', 'authority', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
    await queryInterface.removeColumn('Services', 'step');
  }
};
