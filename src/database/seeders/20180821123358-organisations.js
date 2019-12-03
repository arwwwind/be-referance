'use strict';
const moment = require("moment");
const n = 5;

module.exports = {
    up: (queryInterface, Sequelize) => {
        const organisations = [];
        const date = moment().format("YYYY-MM-DD HH:mm:ssZZ");
        for(let i = 1; i <= n; ++i) {
            organisations.push({
                companyName: "Company name " + i,
                type: "Account",
                address: "address " + i,
                mainPhone: "mainPhone" + i,
                fax: "fax" + i,
                createdAt: date,
                updatedAt: date
            });
        }
        return queryInterface.bulkInsert('Organisations', organisations, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Organisations', null, {});
    }
};
