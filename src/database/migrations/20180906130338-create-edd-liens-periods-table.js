'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('EDDLiensPeriods', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            eddLienId: {
                type: Sequelize.INTEGER
            },
            party: {
                type: Sequelize.STRING
            },
            paymentType: {
                type: Sequelize.STRING
            },
            weeklyRate: {
                type: Sequelize.STRING
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
        }).then(() => {
            return queryInterface.addConstraint('EDDLiensPeriods', ['eddLienId'], {
                type: 'foreign key',
                name: 'fkey_edd_lien_id',
                references: {
                    table: 'EDDLiens',
                    field: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'cascade'
            })
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('EDDLiensPeriods');
    }
};