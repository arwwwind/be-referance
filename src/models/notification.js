'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {});
  /** models can be used as parameter */
  Notification.associate = function() {
    // associations can be defined here
  };
  return Notification;
};
