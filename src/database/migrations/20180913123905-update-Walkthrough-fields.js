'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Walkthroughs', 'confirmADJNumber', {
      type: Sequelize.STRING,
      allowNull: true
    }).then(() => (
      queryInterface.addColumn('Walkthroughs', 'isInsuranceCarrierInformationComplete', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'confirmUAN', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'DOBMakeSense', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'bodyParts', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'bodyPartsMatch', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'AreThereBodyPartsWrittenInCOE', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'IsItFMCNecessary', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'DoesSettlementLanguageComply', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'doctorDate', {
        type: Sequelize.DATE,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'medicalReportType', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'offerOfWorkConfirm', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'offerOfWorkBeforeOrAfter', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'offerOfWorkMakeSense', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'overrideReason', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'additionalDOIS', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'DoesUnpaidMedicalFieldImply', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'areThereInitialsInDoc', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Walkthroughs', 'signedDatedAndNoterarized', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    ));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Walkthroughs', 'confirmADJNumber').then(() => (
      queryInterface.removeColumn('Walkthroughs', 'isInsuranceCarrierInformationComplete')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'confirmUAN')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'DOBMakeSense')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'bodyParts')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'bodyPartsMatch')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'AreThereBodyPartsWrittenInCOE')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'IsItFMCNecessary')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'DoesSettlementLanguageComply')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'doctorDate')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'medicalReportType')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'offerOfWorkConfirm')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'offerOfWorkBeforeOrAfter')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'offerOfWorkMakeSense')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'overrideReason')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'additionalDOIS')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'DoesUnpaidMedicalFieldImply')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'areThereInitialsInDoc')
    )).then(() => (
      queryInterface.removeColumn('Walkthroughs', 'signedDatedAndNoterarized')
    ));
  }
};
