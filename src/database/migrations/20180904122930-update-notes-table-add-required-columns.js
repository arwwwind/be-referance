'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Notes', 'content', {
            type: Sequelize.TEXT,
            allowNull: true
        });
        await queryInterface.addColumn('Notes', 'subject', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Notes', 'activityType', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Notes', 'contactMade', {
            type: Sequelize.BOOLEAN,
            allowNull: true
        });
        await queryInterface.addColumn('Notes', 'contactMadeDate', {
            type: Sequelize.DATE,
            allowNull: true
        });
    },

    down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('Notes', 'content').then(() => (
        queryInterface.removeColumn('Notes', 'subject')
      )).then(() => (
        queryInterface.removeColumn('Notes', 'activityType')
      )).then(() => (
        queryInterface.removeColumn('Notes', 'contactMade')
      )).then(() => (
        queryInterface.removeColumn('Notes', 'contactMadeDate')
      ));
    }
};
