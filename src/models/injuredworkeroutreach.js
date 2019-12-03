'use strict';
module.exports = (sequelize, DataTypes) => {
  const InjuredWorkerOutreach = sequelize.define('InjuredWorkerOutreach', {
    /**
     * XDF
     */
    meetingWithWorker: DataTypes.BOOLEAN,
    lawyerInvolved: DataTypes.BOOLEAN,
    signatureDateObtained: DataTypes.DATE,
    contactReason: DataTypes.STRING,
    result: DataTypes.BOOLEAN,
    meetingLocation: DataTypes.TEXT,
    typeOfWorkerMeeting: DataTypes.STRING,
    negotiatingSettlement: DataTypes.BOOLEAN,
    authority: DataTypes.STRING,
    daysToObtainSignature: DataTypes.TEXT,
    counterOffer: DataTypes.FLOAT,
    IWStillEmployed: DataTypes.BOOLEAN,
    IWMedicareEligible: DataTypes.BOOLEAN,
    SignatureStip: DataTypes.STRING,
    SignatureCANDR: DataTypes.STRING,
    noContact: DataTypes.STRING,
    QMERefusal: DataTypes.STRING,
    subType: DataTypes.STRING,
    SettlementAgreedTo: DataTypes.BOOLEAN,
    updateIntervalMonths: DataTypes.INTEGER,

    /**
     * Other
     */
    meetingStreet: DataTypes.STRING,
    meetingState: DataTypes.STRING,
    meetingCity: DataTypes.STRING,
    meetingZipCode: DataTypes.STRING,
    interpretor: DataTypes.STRING,
    isInterpretorInvolved: DataTypes.BOOLEAN
  }, {});
  InjuredWorkerOutreach.associate = function(models) {
      InjuredWorkerOutreach.hasOne(models.Service, {as: 'service', foreignKey: 'injuredWorkerOutreachId'});
  };
  return InjuredWorkerOutreach;
};
