'use strict';
module.exports = (sequelize, DataTypes) => {
  const PasswordResets = sequelize.define('PasswordResets', {
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    expiresAt: DataTypes.DATE
  }, {});
  PasswordResets.associate = function(models) {
      PasswordResets.belongsTo(models.User, {as: 'user'});
  };
  return PasswordResets;
};
