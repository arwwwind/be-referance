'use strict';
const moment = require("moment");
let count = 0;
const phases = ['review', 'progress', 'invoicing', 'hold', 'suspended'];
const serviceTypes = ['walkthrough', 'injuredWorkerOutreach', 'lienService', 'injuredWorkerInformation', 'eddLien', 'documentPreparation', 'misc'];

module.exports = {
  up: (queryInterface, Sequelize) => {
    const tracks = [];
    const date = moment().format("YYYY-MM-DD HH:mm:ssZZ");

    for(let i = 0; i < serviceTypes.length; ++i) {
      for(let j = 0; j < phases.length; ++j) {
        ++count;
        tracks.push({
          name: "name " + count,
          preAssignedTo: 1,
          dueDate: moment().add(count, 'day').format("YYYY-MM-DD HH:mm:ssZZ"),
          summary: "summary " + count,
          priority: "high",
          taskType: "meeting",
          serviceType: serviceTypes[i],
          phase: phases[j],
          position: "0",
          description: "description " + count,
          createdAt: date,
          updatedAt: date
        });
      }
    }

    return queryInterface.bulkInsert('Tracks', tracks, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tracks', null, {});
  }
};
