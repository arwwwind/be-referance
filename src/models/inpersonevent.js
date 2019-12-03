'use strict';
module.exports = (sequelize, DataTypes) => {
  const InPersonEvent = sequelize.define('InPersonEvent', {
    dateOfHEaring: DataTypes.DATE,
    status: DataTypes.STRING,
    resourceConfirmed: DataTypes.BOOLEAN,
    color: DataTypes.STRING,
    type: DataTypes.STRING,
    description: DataTypes.TEXT,
    scheduledOrRandom: DataTypes.STRING,

    /**
     * Other
     */
    dateTime: DataTypes.DATE,
    rating: DataTypes.INTEGER,
    ratingReason: DataTypes.TEXT
  }, {
    paranoid: true
  });
  InPersonEvent.associate = function(models) {
    InPersonEvent.belongsTo(models.Case, {as: 'case'});
    InPersonEvent.belongsTo(models.Venue, {as: 'venue'});
    InPersonEvent.belongsTo(models.Judge, {as: 'judge'});
    InPersonEvent.belongsTo(models.Service, {as: 'service'});
    InPersonEvent.belongsTo(models.ContactProfile, {as: 'rep'});
    InPersonEvent.belongsTo(models.ContactProfile, {as: 'creator'});
  };
  return InPersonEvent;
};
