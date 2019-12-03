import passport from 'passport';
import bcrypt from 'bcrypt-nodejs';
import config from '../config.json';
import Raven from "raven";

const LocalStrategy = require('passport-local').Strategy;
const AuthTokenStrategy = require('passport-auth-token').Strategy;
const User = require('../models').User;
const TrustToken = require('../models').TrustToken;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const findUserBy = (column, value) => User.findOne({
  where: {
    [column]: value
  }
}).then(user => {
  if(!user.active) {
    throw new Error('User is not active on the juvo platform');
  }

  return user;
}).catch(e => Promise.reject(e));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, cb) {
    return findUserBy('loginEmail', email).then(user => {
      if (!user) {
        return cb(null, false);
      }

      bcrypt.compare(password, user.password, function (err, res) {
        if(err) {
          Raven.captureException(err);
        }

        if (!res) {
          return cb(null, false);
        }

        return cb(null, user);
      });

    })
    .catch(err => cb(err));
  }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : config.secretKey
  },
  function (jwtPayload, cb) {
    return findUserBy('id', jwtPayload.id)
      .then(user => {
        return cb(null, user);
      })
      .catch(err => {
        return cb(err);
      });
  }
));

passport.use(new AuthTokenStrategy(
  {
    passReqToCallback: true,
    headerFields: ['authorization']
  },
  async function(req, token, done) {
    try {
      const trustToken = await TrustToken.findOne({
        where: {
          value: token
        }
      });

      if(trustToken) {
        const email = req.body.email || req.query.email;
        const user = await findUserBy('googleEmailLogin', email) || await findUserBy('loginEmail', email);

        if(!user) {
          return done(null, false);
        }

        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch(error) {
      return done(error);
    }
  }
));
