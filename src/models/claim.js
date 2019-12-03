'use strict';
module.exports = (sequelize, DataTypes) => {
  const Claim = sequelize.define('Claim', {
    claimNumber: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    dateOfInjuryStart: DataTypes.DATE,
    dateOfInjuryEnd: DataTypes.DATE,
    ADJNumber: DataTypes.STRING,
    acceptedBodyParts: DataTypes.STRING,
    deniedBodyParts: DataTypes.STRING,
    bodyPartsDetails: DataTypes.STRING
  }, {});
  Claim.associate = function(models) {
      Claim.belongsTo(models.Case, {as: 'case'});
      Claim.belongsTo(models.Service, {as: 'service'});
  };
  return Claim;
};
