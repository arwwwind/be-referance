'use strict';
module.exports = (sequelize, DataTypes) => {
  const PartnerService = sequelize.define('PartnerService', {
    declineReason: DataTypes.STRING,
    offerDate: DataTypes.DATE,
    signDate: DataTypes.DATE,
    medicalAmount: DataTypes.FLOAT,
    partnerName: DataTypes.STRING,
    serviceDescription: DataTypes.TEXT,
    serviceType: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    paranoid: true
  });
  PartnerService.associate = function(models) {
    PartnerService.belongsTo(models.Service, {as: "service"});
  };
  return PartnerService;
};
