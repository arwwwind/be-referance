'use strict';
module.exports = (sequelize, DataTypes) => {
  const ServiceActions = sequelize.define('ServiceActions', {
    action: DataTypes.STRING,
    reason: DataTypes.TEXT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {});
  ServiceActions.associate = function(models) {
    ServiceActions.belongsTo(models.ContactProfile, {as: "profile"});
    ServiceActions.belongsTo(models.Service, {as: "service"});
  };
  return ServiceActions;
};
