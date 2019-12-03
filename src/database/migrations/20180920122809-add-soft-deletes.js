'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Cases', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Services', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Organisations', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Judges', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Resources', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Venues', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('PartnerServices', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('InPersonEvents', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('ContactProfiles', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Cases', 'deletedAt');
    await queryInterface.removeColumn('Services', 'deletedAt');
    await queryInterface.removeColumn('Organisations', 'deletedAt');
    await queryInterface.removeColumn('Judges', 'deletedAt');
    await queryInterface.removeColumn('Resources', 'deletedAt');
    await queryInterface.removeColumn('Venues', 'deletedAt');
    await queryInterface.removeColumn('PartnerServices', 'deletedAt');
    await queryInterface.removeColumn('InPersonEvents', 'deletedAt');
    await queryInterface.removeColumn('ContactProfiles', 'deletedAt');
  }
};
