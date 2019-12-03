'use strict';
const moment = require("moment");
const n = 5;

module.exports = {
    up: (queryInterface, Sequelize) => {
        const notes = [];
        const casePivots = [];
        const servicePivots = [];
        const date = moment().format("YYYY-MM-DD HH:mm:ssZZ");
        for(let i = 1; i <= 2 * n; ++i) {
            notes.push({
                content: "content " + i,
                subject: "subject " + i,
                noteCreatorId: Math.min(i, n),
                createdAt: date,
                updatedAt: date
            });
        }
        for(let i = 1; i <= n; ++i) {
            casePivots.push({
                caseId: i,
                noteId: i,
                createdAt: date,
                updatedAt: date
            });
        }
        for(let i = n + 1; i <= 2 * n; ++i) {
            servicePivots.push({
                serviceId: (i % n) + 1,
                noteId: i,
                createdAt: date,
                updatedAt: date
            });
        }

        return Promise.all([
            queryInterface.bulkInsert('Notes', notes, {}),
            queryInterface.bulkInsert('CasesNotesPivot', casePivots, {}),
            queryInterface.bulkInsert('ServicesNotesPivot', servicePivots, {})
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.bulkDelete('Notes', null, {}),
            queryInterface.bulkDelete('CasesNotesPivot', null, {}),
            queryInterface.bulkDelete('ServicesNotesPivot', null, {})
        ]);
    }
};
