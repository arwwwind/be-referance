'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Services', 'currentClaimHandlerId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => (
      queryInterface.addConstraint('Services', ['currentClaimHandlerId'], {
        type: 'foreign key',
        name: 'fkey_claim_handler_id',
        references: {
          table: 'ContactProfiles',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'serviceOwnerId', {
        type: Sequelize.INTEGER,
        allowNull: true
      }).then(() => (
        queryInterface.addConstraint('Services', ['serviceOwnerId'], {
          type: 'foreign key',
          name: 'fkey_service_owner_id',
          references: {
            table: 'ContactProfiles',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        })
      ))
    )).then(() => (
      queryInterface.addColumn('Services', 'hearingDate', {
        type: Sequelize.DATE,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'eddOffice', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'serviceSubType', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'referredById', {
        type: Sequelize.INTEGER
      }).then(() => {
        return queryInterface.addConstraint('Services', ['referredById'], {
          type: 'foreign key',
          name: 'fkey_referred_by_id',
          references: {
            table: 'ContactProfiles',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        })
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'IWPName', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'venueId', {
        type: Sequelize.INTEGER,
        allowNull: true
      }).then(() => (
        queryInterface.addConstraint('Services', ['venueId'], {
          type: 'foreign key',
          name: 'fkey_venue_id',
          references: {
            table: 'Venues',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        })
      ))
    )).then(() => (
      queryInterface.addColumn('Services', 'actualVenueId', {
        type: Sequelize.INTEGER,
        allowNull: true
      }).then(() => (
        queryInterface.addConstraint('Services', ['actualVenueId'], {
          type: 'foreign key',
          name: 'fkey_actual_venue_id',
          references: {
            table: 'Venues',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        })
      ))
    )).then(() => (
      queryInterface.addColumn('Services', 'TDPaid', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'PDPaid', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'PDValue', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'PDPercentage', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'MedicalPaid', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'confirmBenefitPrintout', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'ADJNumber', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'applicantAttorneyId', {
        type: Sequelize.INTEGER
      }).then(() => {
        return queryInterface.addConstraint('Services', ['applicantAttorneyId'], {
          type: 'foreign key',
          name: 'fkey_applicant_attorney_by_id',
          references: {
            table: 'ContactProfiles',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        })
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'settlementAmount', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'leavingBalance', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'invoicerId', {
        type: Sequelize.INTEGER
      }).then(() => {
        return queryInterface.addConstraint('Services', ['invoicerId'], {
          type: 'foreign key',
          name: 'fkey_invoicer_id',
          references: {
            table: 'Organisations',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        })
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'employerInformation', {
        type: Sequelize.STRING,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'iwDob', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    )).then(() => (
      queryInterface.addColumn('Services', 'lawyerOrganization', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Services', 'currentClaimHandlerId').then(() => (
      queryInterface.removeColumn('Services', 'serviceOwnerId')
    )).then(() => (
      queryInterface.removeColumn('Services', 'hearingDate')
    )).then(() => (
      queryInterface.removeColumn('Services', 'eddOffice')
    )).then(() => (
      queryInterface.removeColumn('Services', 'serviceSubType')
    )).then(() => (
      queryInterface.removeColumn('Services', 'referredById')
    )).then(() => (
      queryInterface.removeColumn('Services', 'IWPName')
    )).then(() => (
      queryInterface.removeColumn('Services', 'venueId')
    )).then(() => (
      queryInterface.removeColumn('Services', 'actualVenueId')
    )).then(() => (
      queryInterface.removeColumn('Services', 'TDPaid')
    )).then(() => (
      queryInterface.removeColumn('Services', 'PDPaid')
    )).then(() => (
      queryInterface.removeColumn('Services', 'PDValue')
    )).then(() => (
      queryInterface.removeColumn('Services', 'MedicalPaid')
    )).then(() => (
      queryInterface.removeColumn('Services', 'PDPercentage')
    )).then(() => (
      queryInterface.removeColumn('Services', 'confirmBenefitPrintout')
    )).then(() => (
      queryInterface.removeColumn('Services', 'ADJNumber')
    )).then(() => (
      queryInterface.removeColumn('Services', 'applicantAttorneyId')
    )).then(() => (
      queryInterface.removeColumn('Services', 'settlementAmount')
    )).then(() => (
      queryInterface.removeColumn('Services', 'leavingBalance')
    )).then(() => (
      queryInterface.removeColumn('Services', 'invoicerId')
    )).then(() => (
      queryInterface.removeColumn('Services', 'employerInformation')
    )).then(() => (
      queryInterface.removeColumn('Services', 'iwDob')
    )).then(() => (
      queryInterface.removeColumn('Services', 'lawyerOrganization')
    ));
  }
};
