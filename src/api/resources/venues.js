import resource from 'resource-router-middleware';
import response from '../concerns/response';
import Raven from "raven";
import {getPaginatorOptions} from "../concerns/modifiers";

const Model = require('../../models/index').Venue;
const ContactProfile = require('../../models/index').ContactProfile;

/**
 * For requests with an `id`, you can auto-load the entity.
 *  Errors terminate the request, success sets `req[id] = data`.
 */
const load = async (req, id, callback) => {
  try {
    const model = await Model.findById(id, {
      include: [
        {
          model: ContactProfile,
          as: 'IAOfficers'
        },
        {
          model: ContactProfile,
          as: 'EDDReps'
        },
        {
          model: ContactProfile,
          as: 'boardReps'
        }
      ]
    });

    if(model) {
      callback(null, model);
    } else {
      callback(response(null).error('Not found', 404));
    }
  } catch(err) {
    Raven.captureException(err);
    callback(response(null).error('Internal server error', 500));
  }
};

/**
 * Creates a transaction in the db, in order to create or update a venue
 *
 * @param db
 * @param body
 * @param res
 * @param action
 * @return {Promise<T>}
 */
const actionUserWithRelations = (db, body, res, action) => {
  return db.transaction((t) => {
    return action(body, {transaction: t})
      .then((data) => {
        return Promise.all([
          body.IAOfficers ? data.setIAOfficers(body.IAOfficers, {transaction: t}) : data,
          body.EDDReps ? data.setEDDReps(body.EDDReps, {transaction: t}) : data
        ]);
      });
  }).then(function (result) {
    // Transaction has been committed
    response(res).item(result);
  }).catch(function (err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  });
};

export default ({ config, db, validate, validation }) => resource({

  /** Property name to store preloaded entity on `request`. */
  id : 'model',

  load,

  /** GET / - List all entities */
  async index(req, res) {
    try {
      await Model.findAndCountAll({
        order: [
          ['id', 'DESC']
        ],
        limit: req.query.limit,
        offset: req.skip
      }).then(results => {
        response(res).collectionPaginated(getPaginatorOptions(req, results));
      });
    } catch(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  },

  /** POST / - Create a new entity */
  create: [
    validate(validation.venues),
    async ({ body }, res) => {
      try {
        await actionUserWithRelations(db, body, res, Model.create.bind(Model));
      } catch(err) {
        response(res).error(err, 422);
      }
    }
  ],

  /** GET /:id - Return a given entity */
  read({ model }, res) {
    response(res).item(model);
  },

  /** PUT /:id - Update a given entity */
  update: [
    validate(validation.venues),
    async({ model, body }, res) => {
      try {
        await actionUserWithRelations(db, body, res, model.updateAttributes.bind(model));
      } catch(err) {
        response(res).error(err, 422);
      }
    }
  ],

  /** DELETE /:id - Delete a given entity */
  async delete({ model }, res) {
    try {
      await model.destroy();
      res.sendStatus(204);
    } catch(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  }
});
