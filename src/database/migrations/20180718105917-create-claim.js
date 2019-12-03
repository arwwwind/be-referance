'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Claims', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      claimNumber: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      dateOfInjuryStart: {
        type: Sequelize.DATE
      },
      dateOfInjuryEnd: {
        type: Sequelize.DATE
      },
      ADJNumber: {
        type: Sequelize.STRING
      },
      acceptedBodyParts: {
        type: Sequelize.STRING
      },
      deniedBodyParts: {
        type: Sequelize.STRING
      },
      bodyPartsDetails: {
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
    return queryInterface.dropTable('Claims');
  }
};