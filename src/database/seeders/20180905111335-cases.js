'use strict';
const moment = require("moment");
const n = 5;

module.exports = {
    up: (queryInterface, Sequelize) => {
        const cases = [];
        const date = moment().format("YYYY-MM-DD HH:mm:ssZZ");
        for(let i = 1; i <= n; ++i) {
            cases.push({
                name: "name " + i,
                referralDate: moment().add(i, "days").format("YYYY-MM-DD HH:mm:ssZZ"),
                description: "description " + i,
                injuredWorkerId: i,
                referralId: i,
                caseOwnerId: i,
                createdAt: date,
                updatedAt: date
            });
        }
        return queryInterface.bulkInsert('Cases', cases, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Cases', null, {});
    }
};
