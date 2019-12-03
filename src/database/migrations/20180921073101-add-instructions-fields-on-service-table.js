'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Services', 'contactSpecialInstructions', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('Services', 'accountSpecialInstructions', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('Services', 'venueSpecialInstructions', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Services', 'contactSpecialInstructions');
    await queryInterface.removeColumn('Services', 'accountSpecialInstructions');
    await queryInterface.removeColumn('Services', 'venueSpecialInstructions');
  }
};
