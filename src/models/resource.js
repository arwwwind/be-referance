'use strict';

module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define('Resource', {
    internalName: DataTypes.STRING,
    description: DataTypes.TEXT,
    resourceTag: DataTypes.STRING,
    starRating: DataTypes.INTEGER,
    ratingDescription: DataTypes.TEXT
  }, {
    paranoid: true
  });
  Resource.associate = function(models) {
    Resource.belongsTo(models.ContactProfile, {as: 'worker'});
    Resource.belongsTo(models.Organisation, {as: 'organisation'});
    Resource.belongsTo(models.Service, {as: 'service'});
    Resource.belongsTo(models.Case, {as: 'case'});
    Resource.hasMany(models.Tasks, {as: 'tasks', foreignKey: 'resourceId'});
  };
  return Resource;
};
