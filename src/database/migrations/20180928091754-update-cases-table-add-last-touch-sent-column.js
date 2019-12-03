'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Cases', 'notifyLastTouch', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Cases', 'notifyLastTouchDaysNo', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Cases', 'notifyLastTouch');
    await queryInterface.removeColumn('Cases', 'notifyLastTouchDaysNo');
  }
};
