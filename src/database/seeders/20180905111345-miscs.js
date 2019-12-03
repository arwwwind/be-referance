'use strict';
const moment = require("moment");
const n = 5;

module.exports = {
    up: (queryInterface, Sequelize) => {
        const miscs = [];
        const date = moment().format("YYYY-MM-DD HH:mm:ssZZ");
        for(let i = 1; i <= n; ++i) {
            miscs.push({
                tag: "tag " + i,
                updateIntervalMonths: i,
                createdAt: date,
                updatedAt: date
            });
        }
        return queryInterface.bulkInsert('Miscs', miscs, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Miscs', null, {});
    }
};
