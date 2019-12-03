'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Organisations', 'faxLink', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Organisations', 'primaryPhoneNumberType', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Organisations', 'primaryPhoneNumber', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Organisations', 'primaryPhoneNumberExtension', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Organisations', 'secondaryPhoneNumberType', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Organisations', 'secondaryPhoneNumber', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Organisations', 'secondaryPhoneNumberExtension', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Organisations', 'walkthroughPricing', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Organisations', 'lienServicePricing', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Organisations', 'eddLienServicePricing', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Organisations', 'injuredWorkerOutreachPricing', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Organisations', 'documentPreparationPricing', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Organisations', 'careMeetingPricing', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Organisations', 'miscPricing', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Organisations', 'faxLink');
    await queryInterface.removeColumn('Organisations', 'primaryPhoneNumberType');
    await queryInterface.removeColumn('Organisations', 'primaryPhoneNumber');
    await queryInterface.removeColumn('Organisations', 'primaryPhoneNumberExtension');
    await queryInterface.removeColumn('Organisations', 'secondaryPhoneNumberType');
    await queryInterface.removeColumn('Organisations', 'secondaryPhoneNumber');
    await queryInterface.removeColumn('Organisations', 'secondaryPhoneNumberExtension');
    await queryInterface.removeColumn('Organisations', 'walkthroughPricing');
    await queryInterface.removeColumn('Organisations', 'lienServicePricing');
    await queryInterface.removeColumn('Organisations', 'eddLienServicePricing');
    await queryInterface.removeColumn('Organisations', 'injuredWorkerOutreachPricing');
    await queryInterface.removeColumn('Organisations', 'documentPreparationPricing');
    await queryInterface.removeColumn('Organisations', 'careMeetingPricing');
    await queryInterface.removeColumn('Organisations', 'miscPricing');
  }
};
