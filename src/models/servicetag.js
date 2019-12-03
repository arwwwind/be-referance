'use strict';
module.exports = (sequelize, DataTypes) => {
  const ServiceTag = sequelize.define('ServiceTag', {
    label: DataTypes.STRING
  }, {});
  ServiceTag.associate = function(models) {
    ServiceTag.belongsTo(models.Service, {as: 'service'});
  };
  return ServiceTag;
};
