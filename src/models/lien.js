'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lien = sequelize.define('Lien', {
    /**
     * XDF
     */
    settledBeforeLitigation: DataTypes.DATE,
    resolvedDate: DataTypes.DATE,
    settlementSummary: DataTypes.TEXT,
    description: DataTypes.TEXT,
    flagged: DataTypes.BOOLEAN,
    flagReason: DataTypes.STRING,
    dateOfServiceStart: DataTypes.DATE,
    dateOfServiceEnd: DataTypes.DATE,
    fillingDate: DataTypes.DATE,
    authority: DataTypes.STRING,
    paid: DataTypes.DATE,
    balance: DataTypes.FLOAT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    defenses: DataTypes.STRING,
    inCourtOutOfCourt: DataTypes.BOOLEAN,
    deferred: DataTypes.STRING,
    resolvedByOther: DataTypes.STRING,

    /**
     * Other
     */
    demand: DataTypes.STRING,
    requestedStatus: DataTypes.STRING
  }, {});
  Lien.associate = function(models) {
    Lien.belongsTo(models.Service, {as: 'service'});
    Lien.belongsTo(models.Organisation, {as: 'claimentName'});
    Lien.belongsTo(models.ContactProfile, {as: 'representedBy'});
  };
  return Lien;
};
