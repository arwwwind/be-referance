'use strict';
const moment = require("moment");
const n = 5;

module.exports = {
    up: (queryInterface, Sequelize) => {
        const judges = [];
        const date = moment().format("YYYY-MM-DD HH:mm:ssZZ");
        for(let i = 1; i <= n; ++i) {
            judges.push({
                firstName: "first name " + i,
                lastName: "last name " + i,
                createdAt: date,
                updatedAt: date,
                venueId: i
            });
        }
        return queryInterface.bulkInsert('Judges', judges, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Judges', null, {});
    }
};
