'use strict';
module.exports = (sequelize, DataTypes) => {
  const Case = sequelize.define('Case', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    referralDate: DataTypes.DATE,
    softDeleteRequested: DataTypes.BOOLEAN,
    softDeleted: DataTypes.BOOLEAN,
    cancelReason: DataTypes.TEXT,
    status: DataTypes.STRING,
    googleDriveID: DataTypes.STRING,
    caseSettlementAmount: DataTypes.FLOAT,
    noticeRepFiledServed: DataTypes.BOOLEAN,
    notifyLastTouch: DataTypes.DATE,
    notifyLastTouchDaysNo: DataTypes.INTEGER,
    adjusterUpdatedAt: DataTypes.DATE
  }, {
    paranoid: true
  });
  Case.associate = function(models) {
    Case.hasMany(models.Claim, {as: 'claims', foreignKey: 'caseId'});
    Case.hasMany(models.Service, {as: 'services', foreignKey: 'caseId'});
    Case.hasMany(models.Resource, {as: 'resources', foreignKey: 'caseId'});
    Case.belongsTo(models.ContactProfile, {as: 'referral'});
    Case.belongsTo(models.ContactProfile, {as: 'caseOwner'});
    Case.belongsTo(models.ContactProfile, {as: 'injuredWorker'});
    Case.belongsTo(models.Organisation, {as: 'account'});
    Case.belongsToMany(models.Notes, {through: "CasesNotesPivot", as: "notes", foreignKey: "caseId"});
  };
  return Case;
};
