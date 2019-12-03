import resource from 'resource-router-middleware';
import response from '../concerns/response';
import Raven from "raven";
import {Op} from 'sequelize';

const Model = require('../../models/index').Track;
const ContactProfile = require('../../models/index').ContactProfile;
const Organisation = require('../../models/index').Organisation;

const serviceTypes = ['walkthrough', 'injuredWorkerOutreach', 'lienService', 'injuredWorkerInformation', 'eddLien', 'documentPreparation', 'misc'];
const phases = ['review', 'progress', 'invoicing', 'hold', 'suspended'];

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
          as: "preAssignedToUser"
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

const initializeTracks = () => {
  const tracks = {};
  for(const serviceType of serviceTypes) {
    tracks[serviceType] = {
      tasks: [],
      phases: {}
    };
    for(const phase of phases) {
      tracks[serviceType]["phases"][phase] = [];
    }
  }
  return tracks;
};

/**
 * Creates a transaction in the db, in order to create a track
 *
 * @param db
 * @param body
 * @param res
 * @return {Promise<T>}
 */
const createTrack = (db, body, res) => {
  return db.transaction((t) => {
    return Model.create({...body, position: body.newPosition}, {transaction: t})
      .then((data) => {
        const promises = [];
        promises.push(Model.update({position: db.literal('position +1')}, {where: {
            [Op.and]: [
              {
                phase: data.phase
              },
              {
                position: {
                  [Op.gte]: body.newPosition
                }
              },
              {
                id: {
                  [Op.ne]: data.id
                }
              }
            ]
          }, transaction: t}));
        return Promise.all(promises).then(() => data).catch((err) => Promise.reject(err));
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
      await Model.findAll({
        include: [
          {
            model: ContactProfile,
            as: "preAssignedToUser",
            include: [
              {
                model: Organisation,
                as: "organisation"
              }
            ]
          }
        ],
        order: [
          ['position', 'ASC']
        ]
      }).then(results => {
        const tracks = initializeTracks();
        results.map((item) => {
          tracks[item.serviceType]["tasks"].push(item);
          tracks[item.serviceType]["phases"][item.phase].push(item.id);
        });
        response(res).item(tracks);
      });
    } catch(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  },

  /** POST / - Create a new entity */
  create: [
    validate(validation.tracks.create),
    async ({ body }, res) => {
      try {
        await createTrack(db, body, res);
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
    validate(validation.tracks.update),
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
