'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrganisationNotesPivot', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organisationId: {
        type: Sequelize.INTEGER,
        references: { model: 'Organisations', key: 'id' },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      noteId: {
        type: Sequelize.INTEGER,
        references: { model: 'Notes', key: 'id' },
        onDelete: 'cascade',
        onUpdate: 'cascade'
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

    await queryInterface.createTable('VenueNotesPivot', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      venueId: {
        type: Sequelize.INTEGER,
        references: { model: 'Venues', key: 'id' },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      noteId: {
        type: Sequelize.INTEGER,
        references: { model: 'Notes', key: 'id' },
        onDelete: 'cascade',
        onUpdate: 'cascade'
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

    await queryInterface.createTable('JudgeNotesPivot', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      judgeId: {
        type: Sequelize.INTEGER,
        references: { model: 'Judges', key: 'id' },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      noteId: {
        type: Sequelize.INTEGER,
        references: { model: 'Notes', key: 'id' },
        onDelete: 'cascade',
        onUpdate: 'cascade'
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

    await queryInterface.createTable('ContactProfileNotesPivot', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contactProfileId: {
        type: Sequelize.INTEGER,
        references: { model: 'ContactProfiles', key: 'id' },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      noteId: {
        type: Sequelize.INTEGER,
        references: { model: 'Notes', key: 'id' },
        onDelete: 'cascade',
        onUpdate: 'cascade'
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

    await queryInterface.renameColumn('Judges', 'notes', 'judgeNotes');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OrganisationNotesPivot');
    await queryInterface.dropTable('VenueNotesPivot');
    await queryInterface.dropTable('JudgeNotesPivot');
    await queryInterface.dropTable('ContactProfileNotesPivot');

    await queryInterface.renameColumn('Judges', 'judgeNotes', 'notes');
  }
};
