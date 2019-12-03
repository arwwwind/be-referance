'use strict';
module.exports = (sequelize, DataTypes) => {
  const EDDLien = sequelize.define('EDDLien', {
        disputedPeriod: DataTypes.RANGE,
        paymentRate: DataTypes.FLOAT,
        bodyPartCertified: DataTypes.BOOLEAN,
        physicianCertified: DataTypes.BOOLEAN,
        dateOfNoticeToCarrier: DataTypes.DATE,
        EDDLienAuthority: DataTypes.FLOAT,
        EDDLienType: DataTypes.STRING,
        agreeOrDisagree: DataTypes.BOOLEAN,
        disagreeReason: DataTypes.TEXT,
        EDDLienOffice: DataTypes.STRING,
        updateIntervalMonths: DataTypes.INTEGER,
        certifiedDoctor: DataTypes.STRING,
        certifiedBodyParts: DataTypes.STRING,
        doctor: DataTypes.STRING,
        bodyParts: DataTypes.STRING
    }, {});
    EDDLien.associate = function(models) {
        EDDLien.hasOne(models.Service, {as: 'service', foreignKey: 'eddLienId'});
        EDDLien.belongsTo(models.ContactProfile, {as: 'eddRep'});
        EDDLien.hasMany(models.EDDLiensPeriod, {as: 'periods', foreignKey: 'eddLienId'});
    };
    return EDDLien;
};
