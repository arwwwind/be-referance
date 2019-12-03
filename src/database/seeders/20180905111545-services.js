'use strict';
const moment = require("moment");
const n = 5;

module.exports = {
    up: (queryInterface, Sequelize) => {
        const services = [];
        const date = moment().format("YYYY-MM-DD HH:mm:ssZZ");
        for(let i = 1; i <= n; ++i) {
            services.push({
                serviceStartDate: moment().add(i, "days").format("YYYY-MM-DD HH:mm:ssZZ"),
                serviceEnd: moment().add(i, "days").format("YYYY-MM-DD HH:mm:ssZZ"),
                description: "description " + i,
                createdAt: date,
                updatedAt: date,
                serviceType: "misc",
                miscId: i,
                caseId: i
            });
        }
        return queryInterface.bulkInsert('Services', services, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Services', null, {});
    }
};
