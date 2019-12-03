'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ContactProfiles', 'officeNumberType', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('ContactProfiles', 'officeNumberExtension', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('ContactProfiles', 'remoteOrLocal', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ContactProfiles', 'officeNumberType');
    await queryInterface.removeColumn('ContactProfiles', 'officeNumberExtension');
    await queryInterface.removeColumn('ContactProfiles', 'remoteOrLocal');
  }
};
