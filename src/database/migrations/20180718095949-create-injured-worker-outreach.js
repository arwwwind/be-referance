'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('InjuredWorkerOutreaches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      meetingWithWorker: {
        type: Sequelize.BOOLEAN
      },
      lawyerInvolved: {
        type: Sequelize.BOOLEAN
      },
      interpretor: {
        type: Sequelize.BOOLEAN
      },
      signatureDateObtained: {
        type: Sequelize.DATE
      },
      contactReason: {
        type: Sequelize.STRING
      },
      result: {
        type: Sequelize.BOOLEAN
      },
      meetingLocation: {
        type: Sequelize.TEXT
      },
      typeOfWorkerMeeting: {
        type: Sequelize.STRING
      },
      negotiatingSettlement: {
        type: Sequelize.BOOLEAN
      },
      authority: {
        type: Sequelize.FLOAT
      },
      daysToObtainSignature: {
        type: Sequelize.TEXT
      },
      counterOffer: {
        type: Sequelize.FLOAT
      },
      IWStillEmployed: {
        type: Sequelize.BOOLEAN
      },
      IWMedicareEligible: {
        type: Sequelize.BOOLEAN
      },
      SignatureStip: {
        type: Sequelize.STRING
      },
      SignatureCANDR: {
        type: Sequelize.STRING
      },
      noContact: {
        type: Sequelize.STRING
      },
      QMERefusal: {
        type: Sequelize.STRING
      },
      subType: {
        type: Sequelize.STRING
      },
      SettlementAgreedTo: {
        type: Sequelize.BOOLEAN
      },
      updateIntervalMonths: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('InjuredWorkerOutreaches');
  }
};