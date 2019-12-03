import jwt from 'jsonwebtoken';
import passport from 'passport';
import express from 'express';
import config from '../config.json';
import response from './concerns/response';
import Raven from 'raven';
import moment from 'moment';
import {tokenBodyFor} from './concerns/modifiers';

const router = express.Router();
const ContactProfile = require('../models').ContactProfile;
const _ = require('lodash');

router.post('/login', function (req, res, next) {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if(err && err.message === 'User is not active on the juvo platform') {
      return response(res).unauthorized('This account has been deactivated. Please speak with Juvo management to get it unlocked.', 401);
    }

    if(err || !user) {
      return response(res).unauthorized('Invalid email or password', 401);
    }

    req.login(user, {session: false}, async (err) => {
      if(err) {
        Raven.captureException(err);
        return response(res).error('Internal server error', 500);
      }

      const profile = await ContactProfile.findOne({
          where: {
              id: user.profileId
          }
      });
      const token = jwt.sign(tokenBodyFor(user), config.secretKey);
      user.lastLogin = moment().utc().format("YYYY-MM-DD HH:mm:ssZZ");
      user.save().then(() => {
        _.assign(user.dataValues, profile ? {profile} : {});
        response(res).item({user, token});
      }).catch(err => {
        Raven.captureException(err);
        return response(res).error('Internal server error', 500);
      });
    });
  })(req, res);
});

export default router;
