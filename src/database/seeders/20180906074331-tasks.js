'use strict';
const moment = require("moment");
const n = 5;

module.exports = {
    up: (queryInterface, Sequelize) => {
        const tasks = [];
        const date = moment().format("YYYY-MM-DD HH:mm:ssZZ");
        for(let i = 1; i <= n; ++i) {
            tasks.push({
                name: "name " + i,
                dueDate: moment().add(i, "days").format("YYYY-MM-DD HH:mm:ssZZ"),
                summary: "summary " + i,
                taskType: "task type " + i,
                description: "description " + i,
                createdAt: date,
                updatedAt: date,
                workerId: i,
                resourceId: i
            });
        }
        return queryInterface.bulkInsert('Tasks', tasks, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Tasks', null, {});
    }
};
