'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ServiceTags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      label: {
        type: Sequelize.STRING
      },
      serviceId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => (
      queryInterface.addConstraint('ServiceTags', ['serviceId'], {
        type: 'foreign key',
        name: 'fkey_service_id',
        references: {
          table: 'Services',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    ));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ServiceTags');
  }
};
