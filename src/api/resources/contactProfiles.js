import resource from 'resource-router-middleware';
import response from '../concerns/response';
import Raven from "raven";
import {getPaginatorOptions} from '../concerns/modifiers';

const Model = require('../../models/index').ContactProfile;
const Organisation = require('../../models/index').Organisation;
const User = require('../../models/index').User;
const Venue = require('../../models/index').Venue;

/**
 * For requests with an `id`, you can auto-load the entity.
 * Errors terminate the request, success sets `req[id] = data`.
 */
const load = async (req, id, callback) => {
  try {
    const model = await Model.findById(id, {
      include: [
        {
          model: Organisation,
          as: "organisation"
        },
        {
          model: Organisation,
          as: "accounts"
        },
        {
          model: Venue,
          as: "VenuesWhereBoardReps"
        },
        {
          model: User,
          as: "user",
          attributes: {
            exclude: [
              "password",
              "userImage"
            ]
          }
        }
      ],
      attributes: {
        exclude: [
          "userImage"
        ]
      }
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
const actionWithRelations = (db, body, res, action) => {
  return db.transaction((t) => {
    return action(body, {transaction: t})
      .then((data) => {
        return Promise.all([
          body.primaryBoards ? data.setVenuesWhereBoardReps(body.primaryBoards, {transaction: t}) : data,
          body.accounts ? data.setAccounts(body.accounts, {transaction: t}) : data
        ]).then(() => data).catch((err) => Promise.reject(err));
      })
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
    validate(validation.contactProfiles.index),
    async (req, res) => {
      try {
        const includeAndOrder = {
          order: [],
          distinct: true,
          include: [
            {
              model: User,
              as: 'user'
            }
          ]
        };
        if(req.query.sortId && req.query.sortOrder) {
          switch(req.query.sortId) {
            case "name":
              includeAndOrder["order"].push(['firstName', req.query.sortOrder]);
              break;
            case "primary":
              includeAndOrder["order"].push(['primaryPhoneNumberType', req.query.sortOrder]);
              break;
            case "secondary":
              includeAndOrder["order"].push(['secondaryPhoneNumberType', req.query.sortOrder]);
              break;
            case "fax":
              includeAndOrder["order"].push(['faxNumber', req.query.sortOrder]);
              break;
            case "organization":
              includeAndOrder["include"].push({
                  model: Organisation,
                  as: 'organisation',
                  order: [
                    ["companyName", req.query.sortOrder]
                  ]
              });
              break;
            case "organizationTerritory":
              includeAndOrder["include"].push({
                  model: Organisation,
                  as: 'organisation',
                  order: [
                    ["territory", req.query.sortOrder]
                  ]
              });
              break;
            case "linkedUser":
            case "daysSinceLastReferral":
              includeAndOrder["order"].push(['id', "DESC"]);
              break;
            default:
              includeAndOrder["order"].push([req.query.sortId, req.query.sortOrder]);
          }
        } else {
          includeAndOrder["order"].push(['id', 'DESC']);
          includeAndOrder["include"].push({
            model: Organisation,
            as: 'organisation'
          });
        }
        await Model.findAndCountAll({
          ...includeAndOrder,
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
    validate(validation.contactProfiles.create),
    async ({ body }, res) => {
      try {
        await actionWithRelations(db, body, res, Model.create.bind(Model));
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
  update:[
    validate(validation.contactProfiles.create),
    async ({ model, body }, res) => {
      try {
        await actionWithRelations(db, body, res, model.updateAttributes.bind(model));
      } catch(err) {
        response(res).error(err, 422);
      }
    }
  ],

  /** DELETE /:id - Delete a given entity */
  async delete({model, user}, res) {
    if(user.profileId !== model.id) {
      try {
        if(await User.findOne({where: {profileId: model.id}})) {
          response(res).error('This entity does not support this operation.', 400);
        } else {
          await model.destroy();
          res.sendStatus(204);
        }
      } catch (err) {
        Raven.captureException(err);
        response(res).error(err, 500);
      }
    } else {
      response(res).error('Internal server error', 500);
    }
  }
});
