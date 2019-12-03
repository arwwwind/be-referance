'use strict';

module.exports = (sequelize, DataTypes) => {
  const Judge = sequelize.define('Judge', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    judgeNotes: DataTypes.TEXT,
    venueId: DataTypes.INTEGER
  }, {
    paranoid: true
  });
  Judge.associate = function(models) {
    Judge.belongsTo(models.Venue, {as: 'venue'});
    Judge.belongsToMany(models.Notes, {through: "JudgeNotesPivot", as: "notes", foreignKey: "judgeId"});
  };
  return Judge;
};
