import resource from 'resource-router-middleware';
import response from '../concerns/response';
import Raven from "raven";
import {getPaginatorOptions} from "../concerns/modifiers";
import {Op} from "sequelize";

const Model = require('../../models/index').Notes;
const FileAttachment = require('../../models/index').FileAttachment;
const models = {
  case: require('../../models/index').Case,
  service: require('../../models/index').Service,
  organization: require('../../models/index').Organisation,
  venue: require('../../models/index').Venue,
  judge: require('../../models/index').Judge,
  contact: require('../../models/index').ContactProfile
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
          model: FileAttachment,
          as: "files",
          attributes: {
            exclude: [
              "filePath"
            ]
          }
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
 * Updates the pivot table between Note and the given Entity
 *
 * @param data
 * @param entityType
 * @param entityId
 * @param t
 * @return {*}
 */
const sync = (data, entityType, entityId, t) => {
  switch(entityType) {
    case "case":
      return data.addCase(entityId, {transaction: t});
    case "service":
      return data.addService(entityId, {transaction: t});
    case "organization":
      return data.addOrganisation(entityId, {transaction: t});
    case "venue":
      return data.addVenue(entityId, {transaction: t});
    case "judge":
      return data.addJudge(entityId, {transaction: t});
    case "contact":
      return data.addContact(entityId, {transaction: t});
    default:
      return null;
  }
};

/**
 * Creates a transaction in the db, in order to create a note
 *
 * @param db
 * @param body
 * @param res
 * @return {Promise<T>}
 */
const createNote = (db, body, res) => {
  return db.transaction((t) => {
    return Model.create(body, {transaction: t})
      .then(async (data) => {
        await sync(data, body.entityType, body.entityId, t);
        return data;
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
  index: [
    validate(validation.notes.index),
    async (req, res) => {
      try {
        const model = await models[req.query.entityType].findOne({
          where: {
            id: req.query.entityId
          }
        });
        const notesIdArray = await model.getNotes().map(item => item.id);
        await Model.findAndCountAll({
          distinct: true,
          include: [
            {
              model: FileAttachment,
              as: "files",
              attributes: {
                exclude: [
                  "filePath"
                ]
              }
            }
          ],
          where: {
            id: {
              [Op.in]: notesIdArray
            }
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
    validate(validation.notes.create),
    async (req, res) => {
      try {
        await createNote(db, {...req.body, noteCreatorId: req.user.id}, res);
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
    validate(validation.notes.update),
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
