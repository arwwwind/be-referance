'use strict';
module.exports = (sequelize, DataTypes) => {
  const Walkthrough = sequelize.define('Walkthrough', {
    /**
     * XDF
     */
    wholePersonImparement: DataTypes.STRING,
    apportionment: DataTypes.FLOAT,
    futureMedical: DataTypes.STRING,
    TDPaid: DataTypes.FLOAT,
    PDPercent: DataTypes.FLOAT,
    PDPaid: DataTypes.FLOAT,
    LeavingBalance: DataTypes.FLOAT,
    PDValue: DataTypes.FLOAT,
    settlementDocs: DataTypes.BOOLEAN,
    medicalReport: DataTypes.BOOLEAN,
    QMEWaiver: DataTypes.BOOLEAN,
    benefitPrintout: DataTypes.BOOLEAN,
    benefitNotice: DataTypes.BOOLEAN,
    TDBenefitPrintout: DataTypes.BOOLEAN,
    PDBenefitPrintout: DataTypes.BOOLEAN,
    medicalBenefitPrintout: DataTypes.BOOLEAN,
    docWageStatement: DataTypes.STRING,
    docOfferOfWork: DataTypes.STRING,
    docRating: DataTypes.STRING,
    notesToHearingRep: DataTypes.TEXT,
    CandRorStip: DataTypes.STRING,
    injuryDetails: DataTypes.STRING,
    doctorName: DataTypes.STRING,
    DWC1: DataTypes.BOOLEAN,
    MSA: DataTypes.BOOLEAN,
    MSAAmount: DataTypes.FLOAT,
    additionalDocuments: DataTypes.TEXT,
    suspensionReason: DataTypes.TEXT,
    insuredOrSelfInsured: DataTypes.STRING,
    referencedMedicalReportDoctorName: DataTypes.STRING,
    referencedMediacalReportDate: DataTypes.DATE,
    medicalBillsPaid: DataTypes.FLOAT,
    updateIntervalMonths: DataTypes.INTEGER,

    /**
     * Other
     */
    confirmADJNumber: DataTypes.STRING,
    isInsuranceCarrierInformationComplete: DataTypes.BOOLEAN,
    confirmUAN: DataTypes.BOOLEAN,
    DOBMakeSense: DataTypes.BOOLEAN,
    bodyParts: DataTypes.TEXT,
    bodyPartsMatch: DataTypes.BOOLEAN,
    AreThereBodyPartsWrittenInCOE: DataTypes.BOOLEAN,
    IsItFMCNecessary: DataTypes.BOOLEAN,
    DoesSettlementLanguageComply: DataTypes.BOOLEAN,
    doctorDate: DataTypes.DATE,
    medicalReportType: DataTypes.STRING,
    offerOfWorkConfirm: DataTypes.BOOLEAN,
    offerOfWorkBeforeOrAfter: DataTypes.STRING,
    offerOfWorkMakeSense: DataTypes.BOOLEAN,
    overrideReason: DataTypes.TEXT,
    additionalDOIS: DataTypes.BOOLEAN,
    DoesUnpaidMedicalFieldImply: DataTypes.BOOLEAN,
    areThereInitialsInDoc: DataTypes.BOOLEAN,
    signedDatedAndNoterarized: DataTypes.BOOLEAN
  }, {});
  Walkthrough.associate = function(models) {
      Walkthrough.hasOne(models.Service, {as: 'service', foreignKey: 'walkthroughId'});
  };
  return Walkthrough;
};
