'use strict';
module.exports = (sequelize, DataTypes) => {
  const Misc = sequelize.define('Misc', {
    tag: DataTypes.STRING,
    updateIntervalMonths: DataTypes.INTEGER
  }, {});
  Misc.associate = function(models) {
    Misc.hasOne(models.Service, {as: 'service', foreignKey: 'miscId'});
  };
  return Misc;
};
