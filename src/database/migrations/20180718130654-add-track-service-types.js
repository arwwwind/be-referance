'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tracks', 'lienServiceId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Tracks', ['lienServiceId'], {
        type: 'foreign key',
        name: 'fkey_tracks_lien_service_id',
        references: {
          table: 'LienServices',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });

    await queryInterface.addColumn('Tracks', 'injuredWorkerOutreachId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Tracks', ['injuredWorkerOutreachId'], {
        type: 'foreign key',
        name: 'fkey_tracks_injured_worker_outreach_id',
        references: {
          table: 'InjuredWorkerOutreaches',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });

    await queryInterface.addColumn('Tracks', 'walkthroughId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Tracks', ['walkthroughId'], {
        type: 'foreign key',
        name: 'fkey_tracks_walkthrough_id',
        references: {
          table: 'Walkthroughs',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });

    await queryInterface.addColumn('Tracks', 'eddLienId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Tracks', ['eddLienId'], {
        type: 'foreign key',
        name: 'fkey_tracks_edd_lien_id',
        references: {
          table: 'EDDLiens',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });

    await queryInterface.addColumn('Tracks', 'injuredWorkerInformationId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Tracks', ['injuredWorkerInformationId'], {
        type: 'foreign key',
        name: 'fkey_tracks_injured_worker_information_id',
        references: {
          table: 'InjuredWorkerInformations',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });

    await queryInterface.addColumn('Tracks', 'documentPreparationId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Tracks', ['documentPreparationId'], {
        type: 'foreign key',
        name: 'fkey_tracks_document_preparation_id',
        references: {
          table: 'DocumentPreparations',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });

    await queryInterface.addColumn('Tracks', 'miscId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Tracks', ['miscId'], {
        type: 'foreign key',
        name: 'fkey_tracks_misc_id',
        references: {
          table: 'Miscs',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Tracks', 'lienServiceId')
      .then(() => (
        queryInterface.removeColumn('Tracks', 'injuredWorkerOutreachId')
      )).then(() => (
        queryInterface.removeColumn('Tracks', 'walkthroughId')
      )).then(() => (
        queryInterface.removeColumn('Tracks', 'eddLienId')
      )).then(() => (
        queryInterface.removeColumn('Tracks', 'injuredWorkerInformationId')
      )).then(() => (
        queryInterface.removeColumn('Tracks', 'documentPreparationId')
      )).then(() => (
        queryInterface.removeColumn('Tracks', 'miscId')
      ))
  }
};
