'use strict';

module.exports = (sequelize, DataTypes) => {
  const Venue = sequelize.define('Venue', {
    name: DataTypes.STRING,
    abbreviation: DataTypes.STRING,
    address: DataTypes.STRING,
    color: DataTypes.STRING,
    boardNotes: DataTypes.STRING,
    walkThroughSchedule: DataTypes.STRING,
    sameDayAdj: DataTypes.BOOLEAN,
    canWeSelectJudge: DataTypes.BOOLEAN,
    approvalRating: DataTypes.FLOAT
  }, {
    paranoid: true
  });
  Venue.associate = function(models) {
    Venue.hasMany(models.Judge, {as: 'judges', foreignKey: 'venueId'});
    Venue.belongsToMany(models.ContactProfile, {through: "VenuesIAOfficersPivot", as: "IAOfficers", foreignKey: "venueId"});
    Venue.belongsToMany(models.ContactProfile, {through: "VenuesEDDRepsPivot", as: "EDDReps", foreignKey: "venueId"});
    Venue.belongsToMany(models.ContactProfile, {through: "ContactProfilesPrimaryBoardsPivot", as: "boardReps", foreignKey: "venueId"});
    Venue.belongsToMany(models.Notes, {through: "VenueNotesPivot", as: "notes", foreignKey: "venueId"});
  };
  return Venue;
};
