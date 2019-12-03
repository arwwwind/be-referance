'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('InjuredWorkerOutreaches', 'interpretor').then(() => (
      queryInterface.addColumn('InjuredWorkerOutreaches', 'meetingStreet', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('InjuredWorkerOutreaches', 'meetingState', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('InjuredWorkerOutreaches', 'meetingCity', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('InjuredWorkerOutreaches', 'meetingZipCode', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('InjuredWorkerOutreaches', 'interpretor', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('InjuredWorkerOutreaches', 'isInterpretorInvolved', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    ));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('InjuredWorkerOutreaches', 'meetingCity').then(() => (
      queryInterface.removeColumn('InjuredWorkerOutreaches', 'meetingStreet')
    )).then(() => (
      queryInterface.removeColumn('InjuredWorkerOutreaches', 'meetingState')
    )).then(() => (
      queryInterface.removeColumn('InjuredWorkerOutreaches', 'meetingZipCode')
    )).then(() => (
      queryInterface.removeColumn('InjuredWorkerOutreaches', 'interpretor')
    )).then(() => (
      queryInterface.removeColumn('InjuredWorkerOutreaches', 'isInterpretorInvolved')
    )).then(() => (
      queryInterface.addColumn('InjuredWorkerOutreaches', 'interpretor', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    ))
  }
};
