'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('EDDLiens', 'certifiedDoctor', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('EDDLiens', 'certifiedBodyParts', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('EDDLiens', 'doctor', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('EDDLiens', 'bodyParts', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('EDDLiens', 'certifiedDoctor').then(() => (
      queryInterface.removeColumn('EDDLiens', 'certifiedBodyParts')
    )).then(() => (
      queryInterface.removeColumn('EDDLiens', 'doctor')
    )).then(() => (
      queryInterface.removeColumn('EDDLiens', 'bodyParts')
    ));
  }
};
