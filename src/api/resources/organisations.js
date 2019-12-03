import resource from 'resource-router-middleware';
import response from '../concerns/response';
import Raven from "raven";
import { getPaginatorOptions } from "../concerns/modifiers";
import { getAllServices, getAllCases } from "../custom/metrics/organisationOverview";

const Model = require('../../models/index').Organisation;
const Organisation = require('../../models/index').Organisation;

export const collectionHandler = (req, res) => async (results) => {
  for(const row of results.rows) {
    const services = await getAllServices(row.id);
    const cases = getAllCases(services);

    row.totalReferrals = cases.length;
  }

  response(res).collectionPaginated(getPaginatorOptions(req, results), (rows) => {
    return rows.map(row => {
      return {
        ...row.toJSON(),
        totalReferrals: row.totalReferrals
      }
    });
  });
};

/**
 * For requests with an `id`, you can auto-load the entity.
 *  Errors terminate the request, success sets `req[id] = data`.
 */
const load = async (req, id, callback) => {
  try {
    const model = await Model.findById(id, {
      include: [
        {
          model: Organisation,
          as: 'accounts'
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
 * Creates a transaction in the db, in order to create or update an organisation
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
      .then(data => body.accounts ? data.setAccounts(body.accounts, {transaction: t}) : data);
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
        distinct: true,
        include: [
          {
            model: Organisation,
            as: 'accounts'
          }
        ],
        order: [
          ['id', 'DESC']
        ],
        limit: req.query.limit,
        offset: req.skip
      }).then(collectionHandler(req, res));
    } catch(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  },

  /** POST / - Create a new entity */
  create: [
    validate(validation.organisations),
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
    validate(validation.organisations),
    async ({ model, body }, res) => {
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
