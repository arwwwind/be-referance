'use strict';
module.exports = (sequelize, DataTypes) => {
  const LienService = sequelize.define('LienService', {
    designationDate: DataTypes.DATE,
    employer: DataTypes.STRING,
    dateOfDelay: DataTypes.DATE,
    dateOfDenial: DataTypes.DATE,
    dateOfMPNNotice: DataTypes.DATE,
    acceptanceDate: DataTypes.DATE,
    terminationDate: DataTypes.DATE,
    denialReason: DataTypes.STRING,
    primaryTreatingPhysician: DataTypes.STRING,
    basisOfSettlement: DataTypes.TEXT,
    QMEorAME: DataTypes.STRING,
    applicantDepositionDate: DataTypes.DATE,
    updateIntervalMonths: DataTypes.INTEGER
  }, {});
  LienService.associate = function(models) {
      LienService.hasOne(models.Service, {as: 'service', foreignKey: 'lienServiceId'});
  };
  return LienService;
};
