'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ContactProfiles', 'faxLink', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('ContactProfiles', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ContactProfiles', 'faxLink');
    await queryInterface.removeColumn('ContactProfiles', 'description');
  }
};
