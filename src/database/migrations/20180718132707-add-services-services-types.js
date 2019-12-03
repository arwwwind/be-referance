'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Services', 'lienServiceId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Services', ['lienServiceId'], {
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

    await queryInterface.addColumn('Services', 'injuredWorkerOutreachId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Services', ['injuredWorkerOutreachId'], {
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

    await queryInterface.addColumn('Services', 'walkthroughId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Services', ['walkthroughId'], {
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

    await queryInterface.addColumn('Services', 'eddLienId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Services', ['eddLienId'], {
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

    await queryInterface.addColumn('Services', 'injuredWorkerInformationId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Services', ['injuredWorkerInformationId'], {
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

    await queryInterface.addColumn('Services', 'documentPreparationId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Services', ['documentPreparationId'], {
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

    await queryInterface.addColumn('Services', 'miscId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addConstraint('Services', ['miscId'], {
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
    return queryInterface.removeColumn('Services', 'lienServiceId')
      .then(() => (
        queryInterface.removeColumn('Services', 'injuredWorkerOutreachId')
      )).then(() => (
        queryInterface.removeColumn('Services', 'walkthroughId')
      )).then(() => (
        queryInterface.removeColumn('Services', 'eddLienId')
      )).then(() => (
        queryInterface.removeColumn('Services', 'injuredWorkerInformationId')
      )).then(() => (
        queryInterface.removeColumn('Services', 'documentPreparationId')
      )).then(() => (
        queryInterface.removeColumn('Services', 'miscId')
      ));
  }
};
