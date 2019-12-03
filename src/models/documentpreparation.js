'use strict';
module.exports = (sequelize, DataTypes) => {
  const DocumentPreparation = sequelize.define('DocumentPreparation', {
    WCABFilingIncluded: DataTypes.BOOLEAN,
    draftRequest: DataTypes.STRING,
    EfileInPerson: DataTypes.STRING,
    confirmationNumber: DataTypes.BOOLEAN,
    updateIntervalMonths: DataTypes.INTEGER
  }, {});
  DocumentPreparation.associate = function(models) {
      DocumentPreparation.hasOne(models.Service, {as: 'service', foreignKey: 'documentPreparationId'});
  };
  return DocumentPreparation;
};
