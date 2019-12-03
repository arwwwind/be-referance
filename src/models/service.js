'use strict';
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    /**
     * XDF fields
     */
    serviceStartDate: DataTypes.DATE,
    settlementAuthority: DataTypes.STRING,
    cancelReason: DataTypes.TEXT,
    status: DataTypes.STRING,
    notesToHearingRep: DataTypes.TEXT,
    suspended: DataTypes.BOOLEAN,
    permantAndStationeryDate: DataTypes.DATE,
    billingAmount: DataTypes.FLOAT,
    invoiceID: DataTypes.STRING,
    settlementType: DataTypes.STRING,
    caseSettlementDate: DataTypes.DATE,
    declarationOfReadinessFilled: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    primaryTreatingPhysician: DataTypes.STRING,
    demand: DataTypes.STRING,
    rushRequested: DataTypes.BOOLEAN,
    serviceEnd: DataTypes.DATE,
    IWStillEmployed: DataTypes.BOOLEAN,

    /**
     * Other
     */
    serviceType: DataTypes.STRING,
    hearingDate: DataTypes.DATE,
    eddOffice: DataTypes.STRING,
    serviceSubType: DataTypes.STRING,
    IWPName: DataTypes.STRING,
    TDPaid: DataTypes.STRING,
    PDPaid: DataTypes.STRING,
    PDValue: DataTypes.STRING,
    MedicalPaid: DataTypes.STRING,
    PDPercentage: DataTypes.STRING,
    confirmBenefitPrintout: DataTypes.BOOLEAN,
    ADJNumber: DataTypes.STRING,
    settlementAmount: DataTypes.STRING,
    leavingBalance: DataTypes.STRING,
    employerInformation: DataTypes.STRING,
    iwDob: DataTypes.BOOLEAN,
    lawyerOrganization: DataTypes.STRING,
    step: DataTypes.INTEGER,
    holdReason: DataTypes.STRING,
    suspendReason: DataTypes.STRING,
    contactSpecialInstructions: DataTypes.TEXT,
    accountSpecialInstructions: DataTypes.TEXT,
    venueSpecialInstructions: DataTypes.TEXT,
    onHold: DataTypes.BOOLEAN,
    eddLienClaimNumber: DataTypes.STRING,
    eddLienInjuryEndDate: DataTypes.DATE,
    eddLienInjuryStartDate: DataTypes.DATE,
    walkthroughClaimNumber: DataTypes.STRING,
    walkthroughAdjNumber: DataTypes.STRING,
    walkthroughInjuryStartDate: DataTypes.DATE
  }, {
    paranoid: true
  });
  Service.associate = function(models) {
      Service.hasMany(models.Resource, {as: 'resources', foreignKey: 'serviceId'});
      Service.hasMany(models.Claim, {as: 'claims', foreignKey: 'serviceId'});
      Service.belongsTo(models.Case, {as: 'case'});
      Service.belongsTo(models.Venue, {as: 'venue'});
      Service.belongsTo(models.Venue, {as: 'actualVenue'});
      Service.belongsTo(models.Judge, {as: 'judge'});
      Service.belongsTo(models.LienService, {as: 'lienService'});
      Service.belongsTo(models.InjuredWorkerOutreach, {as: 'injuredWorkerOutreach'});
      Service.belongsTo(models.Walkthrough, {as: 'walkthrough'});
      Service.belongsTo(models.EDDLien, {as: 'eddLien'});
      Service.belongsTo(models.InjuredWorkerInformation, {as: 'injuredWorkerInformation'});
      Service.belongsTo(models.DocumentPreparation, {as: 'documentPreparation'});
      Service.belongsTo(models.Misc, {as: 'misc'});
      Service.belongsTo(models.Organisation, {as: 'declarationOfReadinessFilledBy'});
      Service.belongsTo(models.Organisation, {as: 'representative'});
      Service.belongsTo(models.ContactProfile, {as: 'invoicer'});
      Service.belongsTo(models.ContactProfile, {as: 'currentClaimHandler'});
      Service.belongsTo(models.ContactProfile, {as: 'serviceOwner'});
      Service.belongsTo(models.ContactProfile, {as: 'referredBy'});
      Service.belongsTo(models.ContactProfile, {as: 'applicantAttorney'});
      Service.belongsToMany(models.Notes, {through: "ServicesNotesPivot", as: "notes", foreignKey: "serviceId"});
      Service.hasMany(models.ServiceTag, {as: 'tags', foreignKey: 'serviceId'});
      Service.hasMany(models.ServiceActions, {as: 'serviceActions', foreignKey: 'serviceId'});
      Service.hasMany(models.Lien, {as: 'liens', foreignKey: 'serviceId'});
      Service.hasMany(models.ClientUpdate, {as: 'clientUpdates', foreignKey: 'serviceId'});
  };
  return Service;
};
