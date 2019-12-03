const bcrypt = require('bcrypt-nodejs');
const Raven = require("raven");

/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
function toRes(res, status=200) {
	return (err, thing) => {
		if (err) return res.status(500).send(err);

		if (thing && typeof thing.toObject==='function') {
			thing = thing.toObject();
		}
		res.status(status).json(thing);
	};
}

/**
 * Hashes a string using bcrypt. Returns a callback.
 *
 * @param password
 * @param done (callback)
 */
function hashPassword(password, done) {
  bcrypt.genSalt(10, function(err, salt) {
    if(err) {
      Raven.captureException(err);
      return done(err);
    }

    bcrypt.hash(password, salt, null, function(err, hash) {
      if(err) {
          return done(err);
      }

      done(null, hash);
    });
  });
}

/**
 * Generates a hash password based on hashPassword method
 *
 * @param password
 * @returns {Promise<any>}
 */
function generateHashPassword(password) {
    return new Promise((resolve, reject) => {
        hashPassword(password, (err, hash) => {
            if(err) {
                reject(err);
            } else {
                resolve(hash);
            }
        })
    })
}

module.exports = {
    toRes,
    hashPassword,
    generateHashPassword
};