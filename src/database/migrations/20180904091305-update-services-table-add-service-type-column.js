'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('Services', 'serviceType', {
          type: Sequelize.STRING,
          allowNull: true
      });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('Services', 'serviceType');
  }
};
