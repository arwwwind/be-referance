'use strict';
const moment = require("moment");

module.exports = {
  up: (queryInterface, Sequelize) => {
    const tokens = [];
    const date = moment().format("YYYY-MM-DD HH:mm:ssZZ");
    tokens.push({
      name: "Google Widget",
      value: "wEYUWvHMNw^Nkt&n8MaBH*o4!#wU*EF!m!LlP$d9",
      createdAt: date,
      updatedAt: date
    });
    return queryInterface.bulkInsert('TrustTokens', tokens, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TrustTokens', null, {});
  }
};
