import passport from 'passport';
import response from './response';
import Raven from 'raven';

const login = (req, res, user, next) => (
  req.login(user, {session: false}, (err) => {
    if(err) {
      Raven.captureException(err);
      return response(res).error('Internal server error', 500);
    }

    next();
  })
);

export default (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, user) => {
    if(!user) {
      passport.authenticate('authtoken', {session: false}, (err, user) => {
        if(!user) {
          response(res).unauthorized('Not authorized to access this resource');
        } else {
          login(req, res, user, next);
        }
      })(req, res, next);
    } else {
      login(req, res, user, next);
    }
  })(req, res, next);
};
