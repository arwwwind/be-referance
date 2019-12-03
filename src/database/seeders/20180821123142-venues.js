'use strict';
const moment = require("moment");
const n = 5;

module.exports = {
    up: (queryInterface, Sequelize) => {
        const venues = [];
        const date = moment().format("YYYY-MM-DD HH:mm:ssZZ");
        for(let i = 1; i <= n; ++i) {
            venues.push({
                name: "name " + i,
                abbreviation: "abbreviation " + i,
                address: "address " + i,
                walkThroughSchedule: "some schedule" + i,
                sameDayAdj: true,
                canWeSelectJudge: true,
                createdAt: date,
                updatedAt: date
            });
        }
        return queryInterface.bulkInsert('Venues', venues, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Venues', null, {});
    }
};
