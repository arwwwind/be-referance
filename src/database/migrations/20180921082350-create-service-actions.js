'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ServiceActions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      action: {
        type: Sequelize.STRING
      },
      reason: {
        type: Sequelize.TEXT
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addColumn('ServiceActions', 'serviceId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('ServiceActions', ['serviceId'], {
        type: 'foreign key',
        name: 'fkey_service_id',
        references: {
          table: 'Services',
          field: 'id'
        },
        onUpdate: 'cascade'
      })
    });
    await queryInterface.addColumn('ServiceActions', 'profileId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('ServiceActions', ['profileId'], {
        type: 'foreign key',
        name: 'fkey_profile_id',
        references: {
          table: 'ContactProfiles',
          field: 'id'
        },
        onUpdate: 'cascade'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ServiceActions');
  }
};