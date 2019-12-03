'use strict';
const moment = require("moment");
const n = 5;

module.exports = {
    up: (queryInterface, Sequelize) => {
        const profiles = [];
        const date = moment().format("YYYY-MM-DD HH:mm:ssZZ");
        for(let i = 1; i <= n; ++i) {
            profiles.push({
                firstName: "first name " + i,
                lastName: "last name " + i,
                createdAt: date,
                updatedAt: date
            });
        }
        return queryInterface.bulkInsert('ContactProfiles', profiles, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('ContactProfiles', null, {});
    }
};
