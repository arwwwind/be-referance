'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Cases', 'managingAdjustorId', 'managingAdjusterId');
    await queryInterface.renameColumn('Cases', 'referredByAdjustorId', 'referredByAdjusterId');
    await queryInterface.renameColumn('Cases', 'adjustorUpdatedAt', 'adjusterUpdatedAt');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Cases', 'managingAdjusterId', 'managingAdjustorId');
    await queryInterface.renameColumn('Cases', 'referredByAdjusterId', 'referredByAdjustorId');
    await queryInterface.renameColumn('Cases', 'adjusterUpdatedAt', 'adjustorUpdatedAt');
  }
};
