'use strict';

module.exports = (sequelize, DataTypes) => {
  const ContactProfile = sequelize.define('ContactProfile', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    title: DataTypes.STRING,
    email: DataTypes.STRING,
    specialInstructionNotes: DataTypes.STRING,
    verifiedContact: DataTypes.BOOLEAN,
    salesContactNotes: DataTypes.TEXT,
    dateOfBirth: DataTypes.DATE,
    address: DataTypes.STRING,
    contactType: DataTypes.STRING,
    contactTypeOther: DataTypes.STRING,
    eligibleAssignments: DataTypes.STRING,
    makesAppearances: DataTypes.BOOLEAN,
    defaultRole: DataTypes.STRING,
    faxNumber: DataTypes.STRING,
    officeNumber: DataTypes.STRING,
    primaryPhoneNumberType: DataTypes.STRING,
    primaryPhoneNumber: DataTypes.STRING,
    primaryPhoneNumberExtension: DataTypes.STRING,
    secondaryPhoneNumberType: DataTypes.STRING,
    secondaryPhoneNumber: DataTypes.STRING,
    secondaryPhoneNumberExtension: DataTypes.STRING,
    officeNumberType: DataTypes.STRING,
    officeNumberExtension: DataTypes.STRING,
    faxLink: DataTypes.STRING,
    description: DataTypes.TEXT,
    remoteOrLocal: DataTypes.TEXT,
    userImage: DataTypes.STRING,
    hasImage: DataTypes.BOOLEAN
  }, {
    paranoid: true
  });
  ContactProfile.associate = function(models) {
    ContactProfile.belongsToMany(models.Venue, {through: "VenuesIAOfficersPivot", as: "VenuesWhereIAOfficers", foreignKey: "contactId"});
    ContactProfile.belongsToMany(models.Venue, {through: "VenuesEDDRepsPivot", as: "VenuesWhereEDDReps", foreignKey: "contactId"});
    ContactProfile.belongsToMany(models.Venue, {through: "ContactProfilesPrimaryBoardsPivot", as: "VenuesWhereBoardReps", foreignKey: "contactId"});
    ContactProfile.belongsToMany(models.Tasks, {through: "TasksLinkedCases", as: "tasksLinkedCases", foreignKey: "contactId"});
    ContactProfile.belongsTo(models.Organisation, {as: 'organisation'});
    ContactProfile.belongsToMany(models.Organisation, {through: "ContactProfilesAccountsPivot", as: "accounts", foreignKey: "contactId"});

    ContactProfile.hasMany(models.Tasks, {as: 'tasks', foreignKey: 'workerId'});
    ContactProfile.hasMany(models.Track, {as: 'tracks', foreignKey: 'preAssignedTo'});
    ContactProfile.hasOne(models.User, {as: 'user', foreignKey: 'profileId'});
    ContactProfile.belongsToMany(models.Notes, {through: "ContactProfileNotesPivot", as: "notes", foreignKey: "contactProfileId"});
  };
  return ContactProfile;
};
