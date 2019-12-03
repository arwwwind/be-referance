'use strict';
module.exports = (sequelize, DataTypes) => {
  const TrackEvent = sequelize.define('TrackEvent', {
    name: DataTypes.STRING,
    dueFromCompletionOfPrevious: DataTypes.FLOAT,
    summary: DataTypes.TEXT,
    priority: DataTypes.STRING,
    parentCasePhase: DataTypes.STRING,
    order: DataTypes.FLOAT,
    defaultRole: DataTypes.STRING,
    taskType: DataTypes.STRING
  }, {});
  /** models can be used as parameter */
  TrackEvent.associate = function() {
    // associations can be defined here
  };
  return TrackEvent;
};
