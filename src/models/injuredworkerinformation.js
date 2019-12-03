'use strict';
module.exports = (sequelize, DataTypes) => {
  const InjuredWorkerInformation = sequelize.define('InjuredWorkerInformation', {
    medicalReleaseObtained: DataTypes.BOOLEAN,
    juvoChecklistSigned: DataTypes.BOOLEAN,
    IWhasPacket: DataTypes.BOOLEAN,
    updateIntervalMonths: DataTypes.INTEGER
  }, {});
  InjuredWorkerInformation.associate = function(models) {
      InjuredWorkerInformation.hasOne(models.Service, {as: 'service', foreignKey: 'injuredWorkerInformationId'});
  };
  return InjuredWorkerInformation;
};
