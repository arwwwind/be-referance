'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notes = sequelize.define('Notes', {
      type: DataTypes.STRING,
      content: DataTypes.TEXT,
      subject: DataTypes.STRING,
      activityType: DataTypes.STRING,
      contactMade: DataTypes.BOOLEAN,
      contactMadeDate: DataTypes.DATE
  }, {
    paranoid: true
  });
  Notes.associate = function(models) {
      Notes.belongsTo(models.User, {as: 'noteCreator'});
      Notes.belongsToMany(models.Case, {through: "CasesNotesPivot", as: "cases", foreignKey: "noteId"});
      Notes.belongsToMany(models.Service, {through: "ServicesNotesPivot", as: "services", foreignKey: "noteId"});
      Notes.belongsToMany(models.Organisation, {through: "OrganisationNotesPivot", as: "organisations", foreignKey: "noteId"});
      Notes.belongsToMany(models.Venue, {through: "VenueNotesPivot", as: "venues", foreignKey: "noteId"});
      Notes.belongsToMany(models.Judge, {through: "JudgeNotesPivot", as: "judges", foreignKey: "noteId"});
      Notes.belongsToMany(models.ContactProfile, {through: "ContactProfileNotesPivot", as: "contacts", foreignKey: "noteId"});
      Notes.belongsToMany(models.FileAttachment, {through: "NotesFileAttachmentsPivot", as: "files", foreignKey: "noteId"});
  };
  return Notes;
};
