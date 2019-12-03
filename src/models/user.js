'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    googleEmailLogin: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: {
                msg: 'must be valid email'
            }
        }
    },
    userImage: DataTypes.STRING,
    userType: {
        type: DataTypes.STRING
    },
    active: {
        type: DataTypes.BOOLEAN
    },
    lastLogin: {
        type: DataTypes.DATE
    },
    lastPasswordReset: {
        type: DataTypes.DATE
    },
    password: {
        type: DataTypes.STRING
    },
    manager: {
        type: DataTypes.BOOLEAN
    },
    loginEmail: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: {
                msg: 'must be valid email'
            }
        }
    }
  }, {});
  User.associate = function(models) {
    User.belongsTo(models.ContactProfile, {as: 'profile'});
  };
  return User;
};
