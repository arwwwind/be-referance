'use strict';
module.exports = (sequelize, DataTypes) => {
  const EDDLiensPeriod = sequelize.define('EDDLiensPeriod', {
        party: DataTypes.STRING,
        paymentType: DataTypes.STRING,
        weeklyRate: DataTypes.STRING,
        startDate: DataTypes.DATE,
        endDate: DataTypes.DATE,
    }, {});
    EDDLiensPeriod.associate = function(models) {
        EDDLiensPeriod.belongsTo(models.EDDLien, {as: 'eddLien'});
    };
    return EDDLiensPeriod;
};