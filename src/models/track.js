'use strict';
module.exports = (sequelize, DataTypes) => {
  const Track = sequelize.define('Track', {
    name: DataTypes.STRING,
    preAssignedTo: DataTypes.INTEGER,
    dueDate: DataTypes.DATE,
    summary: DataTypes.STRING,
    priority: DataTypes.STRING,
    taskType: DataTypes.STRING,
    description: DataTypes.TEXT,
    serviceType: DataTypes.STRING,
    phase: DataTypes.STRING,
    position: DataTypes.INTEGER
  }, {});
  Track.associate = function(models) {
    Track.belongsTo(models.ContactProfile, {as: 'preAssignedToUser', foreignKey: 'preAssignedTo'});
  };
  return Track;
};
