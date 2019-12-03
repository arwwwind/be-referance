'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Walkthroughs', 'TDPaid');
    await queryInterface.removeColumn('Walkthroughs', 'PDPaid');
    await queryInterface.addColumn('Walkthroughs', 'TDPaid', {
      type: Sequelize.FLOAT,
      allowNull: true
    })
    await queryInterface.addColumn('Walkthroughs', 'PDPaid', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Walkthroughs', 'TDPaid');
    await queryInterface.removeColumn('Walkthroughs', 'PDPaid');
    await queryInterface.addColumn('Walkthroughs', 'TDPaid', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })
    await queryInterface.addColumn('Walkthroughs', 'PDPaid', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })
  }
};
