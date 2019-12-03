import resource from 'resource-router-middleware';
import response from '../concerns/response';
import Raven from "raven";
import { getPaginatorOptions } from "../concerns/modifiers";

const Model = require('../../models/index').Lien;
const Service = require('../../models/index').Service;
const Organisation = require('../../models/index').Organisation;
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
          model: Organisation,
          as: 'claimentName'
        },
        {
          model: ContactProfile,
          as: 'representedBy'
        },
        {
          model: Service,
          as: 'service'
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

export default ({ config, db, validate, validation }) => resource({

  mergeParams: true,

  /** Property name to store preloaded entity on `request`. */
  id : 'model',

  load,

  /** GET / - List all entities */
  index: [
    validate(validation.liens.index),
    async (req, res) => {
      try {
        await Model.findAndCountAll({
          distinct: true,
          include: [
            {
              model: Organisation,
              as: 'claimentName'
            },
            {
              model: ContactProfile,
              as: 'representedBy'
            },
            {
              model: Service,
              as: 'service'
            }
          ],
          where: {
            serviceId: req.query.serviceId
          },
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
    }
  ],

  /** POST / - Create a new entity */
  create: [
    validate(validation.liens.create),
    async ({ body }, res) => {
      try {
        const model = await Model.create(body);
        response(res).item(model);
      } catch (err) {
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
    validate(validation.liens.create),
    async ({ model, body }, res) => {
      try {
        await model.updateAttributes(body);
        res.sendStatus(204);
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
