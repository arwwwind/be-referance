'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Walkthroughs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      wholePersonImparement: {
        type: Sequelize.STRING
      },
      apportionment: {
        type: Sequelize.FLOAT
      },
      futureMedical: {
        type: Sequelize.STRING
      },
      TDPaid: {
        type: Sequelize.BOOLEAN
      },
      PDPercent: {
        type: Sequelize.FLOAT
      },
      PDPaid: {
        type: Sequelize.BOOLEAN
      },
      LeavingBalance: {
        type: Sequelize.FLOAT
      },
      PDValue: {
        type: Sequelize.FLOAT
      },
      settlementDocs: {
        type: Sequelize.BOOLEAN
      },
      medicalReport: {
        type: Sequelize.BOOLEAN
      },
      QMEWaiver: {
        type: Sequelize.BOOLEAN
      },
      benefitPrintout: {
        type: Sequelize.BOOLEAN
      },
      benefitNotice: {
        type: Sequelize.BOOLEAN
      },
      TDBenefitPrintout: {
        type: Sequelize.BOOLEAN
      },
      PDBenefitPrintout: {
        type: Sequelize.BOOLEAN
      },
      medicalBenefitPrintout: {
        type: Sequelize.BOOLEAN
      },
      docWageStatement: {
        type: Sequelize.STRING
      },
      docOfferOfWork: {
        type: Sequelize.STRING
      },
      docRating: {
        type: Sequelize.STRING
      },
      notesToHearingRep: {
        type: Sequelize.TEXT
      },
      CandRorStip: {
        type: Sequelize.STRING
      },
      injuryDetails: {
        type: Sequelize.STRING
      },
      doctorName: {
        type: Sequelize.STRING
      },
      DWC1: {
        type: Sequelize.BOOLEAN
      },
      MSA: {
        type: Sequelize.BOOLEAN
      },
      MSAAmount: {
        type: Sequelize.FLOAT
      },
      additionalDocuments: {
        type: Sequelize.TEXT
      },
      suspensionReason: {
        type: Sequelize.TEXT
      },
      insuredOrSelfInsured: {
        type: Sequelize.STRING
      },
      referencedMedicalReportDoctorName: {
        type: Sequelize.STRING
      },
      referencedMediacalReportDate: {
        type: Sequelize.DATE
      },
      medicalBillsPaid: {
        type: Sequelize.FLOAT
      },
      updateIntervalMonths: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Walkthroughs');
  }
};