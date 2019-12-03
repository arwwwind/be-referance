'use strict';
const moment = require("moment");
const n = 5;

module.exports = {
    up: (queryInterface, Sequelize) => {
        const resources = [];
        const date = moment().format("YYYY-MM-DD HH:mm:ssZZ");
        for(let i = 1; i <= n; ++i) {
            resources.push({
                internalName: "internal name " + i,
                description: "description " + i,
                createdAt: date,
                updatedAt: date,
                workerId: i,
                organisationId: i,
                serviceId: i,
                caseId: i
            });
        }
        return queryInterface.bulkInsert('Resources', resources, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Resources', null, {});
    }
};
