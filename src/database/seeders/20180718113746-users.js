'use strict';
const util = require("../../lib/util");
const moment = require("moment");
const n = 5;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    const date = moment().format("YYYY-MM-DD HH:mm:ssZZ");
    const hashPromises = [];
    for(let i = 1; i <= n; ++i) {
        hashPromises.push(util.generateHashPassword("asd123"));
    }

    return Promise.all(hashPromises).then((values) => {
        for(let i = 1; i <= n - 2; ++i) {
            users.push({
                googleEmailLogin: "test" + i + "@gmail.com",
                userType: "admin",
                active: true,
                manager: false,
                loginEmail: "test" + i + "@mail.com",
                password: values[i - 1],
                createdAt: date,
                updatedAt: date,
                profileId: i
            });
        }
        users.push({
            googleEmailLogin: "test" + (n - 1) + "@gmail.com",
            userType: "admin",
            active: true,
            manager: false,
            loginEmail: "gabe@jinn.tech",
            password: values[n - 2],
            createdAt: date,
            updatedAt: date,
            profileId: n - 1
        });
        users.push({
            googleEmailLogin: "test" + n + "@gmail.com",
            userType: "admin",
            active: true,
            manager: false,
            loginEmail: "marius@nyxpoint.com",
            password: values[n - 1],
            createdAt: date,
            updatedAt: date,
            profileId: n
        });
        return users;
    }).then((data) => {
        return queryInterface.bulkInsert('Users', data, {});
    }).catch(err => console.log(err));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
