'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ContactProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
          type: Sequelize.STRING
      },
      lastName: {
          type: Sequelize.STRING
      },
      title: {
          type: Sequelize.STRING
      },
      officeNumber: {
          type: Sequelize.STRING
      },
      faxNumber: {
          type: Sequelize.STRING
      },
      email: {
          type: Sequelize.STRING
      },
      userImage: {
          type: Sequelize.STRING
      },
      inactive: {
          type: Sequelize.BOOLEAN
      },
      specialInstructionNotes: {
          type: Sequelize.TEXT
      },
      verifiedContact: {
        type: Sequelize.BOOLEAN
      },
      salesContactNotes: {
        type: Sequelize.TEXT
      },
      dateOfBirth: {
        type: Sequelize.DATE
      },
      address: {
        type: Sequelize.STRING
      },
      contactType: {
        type: Sequelize.STRING
      },
      contactTypeOther: {
        type: Sequelize.STRING
      },
      eligibleAssignments: {
        type: Sequelize.STRING
      },
      makesAppearances: {
        type: Sequelize.BOOLEAN
      },
      defaultRole: {
        type: Sequelize.STRING
      },
      primaryPhoneNumberType: {
        type: Sequelize.STRING
      },
      primaryPhoneNumber: {
        type: Sequelize.STRING
      },
      primaryPhoneNumberExtension: {
        type: Sequelize.STRING
      },
      secondaryPhoneNumberType: {
        type: Sequelize.STRING
      },
      secondaryPhoneNumber: {
        type: Sequelize.STRING
      },
      secondaryPhoneNumberExtension: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ContactProfiles');
  }
};