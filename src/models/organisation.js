'use strict';

module.exports = (sequelize, DataTypes) => {
  const Organisation = sequelize.define('Organisation', {
    companyName: DataTypes.STRING,
    type: DataTypes.STRING,
    address: DataTypes.TEXT,
    mainPhone: DataTypes.STRING,
    fax: DataTypes.STRING,
    website: DataTypes.STRING,
    specialInstructionsNotes: DataTypes.TEXT,
    accountVerified: DataTypes.BOOLEAN,
    leinClaimentStayed: DataTypes.BOOLEAN,
    territory: DataTypes.STRING,
    settlementLanguage: DataTypes.TEXT,
    servicesProvided: DataTypes.STRING,
    physicianOrNonPysician: DataTypes.BOOLEAN,

    faxLink: DataTypes.STRING,
    primaryPhoneNumberType: DataTypes.STRING,
    primaryPhoneNumber: DataTypes.STRING,
    primaryPhoneNumberExtension: DataTypes.STRING,
    secondaryPhoneNumberType: DataTypes.STRING,
    secondaryPhoneNumber: DataTypes.STRING,
    secondaryPhoneNumberExtension: DataTypes.STRING,
    walkthroughPricing: DataTypes.STRING,
    lienServicePricing: DataTypes.STRING,
    eddLienServicePricing: DataTypes.STRING,
    injuredWorkerOutreachPricing: DataTypes.STRING,
    documentPreparationPricing: DataTypes.STRING,
    careMeetingPricing: DataTypes.STRING,
    miscPricing: DataTypes.STRING
  }, {
    paranoid: true
  });
  Organisation.associate = function(models) {
    Organisation.belongsToMany(models.Organisation, {through: "OrganisationsAccountsPivot", as: "accounts", foreignKey: "organisationId"});
    Organisation.belongsToMany(models.Organisation, {through: "OrganisationsAccountsPivot", as: "organisations", foreignKey: "accountId"});
    Organisation.belongsToMany(models.ContactProfile, {through: "ContactProfilesAccountsPivot", as: "accountHolders", foreignKey: "organisationId"});
    Organisation.belongsToMany(models.Notes, {through: "OrganisationNotesPivot", as: "notes", foreignKey: "organisationId"});
  };
  return Organisation;
};
