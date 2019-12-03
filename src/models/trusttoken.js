'use strict';
module.exports = (sequelize, DataTypes) => {
  const TrustToken = sequelize.define('TrustToken', {
    name: DataTypes.STRING,
    value: DataTypes.STRING
  }, {});
  /** models can be used as parameter */
  TrustToken.associate = function() {
    // associations can be defined here
  };
  return TrustToken;
};
