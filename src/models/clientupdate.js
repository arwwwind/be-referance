'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClientUpdate = sequelize.define('ClientUpdate', {
    email: DataTypes.STRING,
    subject: DataTypes.STRING,
    activityType: DataTypes.STRING,
    body: DataTypes.TEXT,
    updateDue: DataTypes.DATE,
    openUpdate: DataTypes.DATE,
    openedTime: DataTypes.DATE
  }, {});
  ClientUpdate.associate = function(models) {
    ClientUpdate.belongsTo(models.ContactProfile, {as: 'profile'})
    ClientUpdate.belongsTo(models.Service, {as: 'service'})
  };
  return ClientUpdate;
};
