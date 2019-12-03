import resource from 'resource-router-middleware';
import response from '../concerns/response';
import Raven from "raven";
import {getPaginatorOptions} from "../concerns/modifiers";

const Model = require('../../models/index').Tasks;
const Service = require('../../models/index').Service;
const Resource = require('../../models/index').Resource;
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
          model: Resource,
          as: 'resource',
          include: [
            {
              model: Service,
              as: "service"
            }
          ]
        },
        {
          model: ContactProfile,
          as: 'worker'
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
 * Creates a transaction in the db, in order to create a task
 *
 * @param db
 * @param body
 * @param res
 * @return {Promise<T>}
 */
const createTask = (db, body, res) => {
  return db.transaction((t) => {
    return Model.create(body, {transaction: t})
      .then(data => body.linkedCases ? data.setLinkedCases(body.linkedCases, {transaction: t}) : data)
      .then(async (data) => {
        const service = await Service.findOne({
          where: {
            id: body.serviceId
          },
          transaction: t
        });

        return Resource.create({workerId: body.workerId, serviceId: body.serviceId, caseId: service ? service.caseId : null }, {transaction: t})
          .then((resource) => ({resource, task: data }))
          .catch((err) => Promise.reject(err));
      })
      .then((data) => {
        return Model.update({resourceId: data.resource.id}, {where: {id: data.task.id}, transaction: t});
      });
  }).then(function () {
    // Transaction has been committed
    res.sendStatus(204);
  }).catch(function (err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  });
};

/**
 * Creates a transaction in the db, in order to update a task
 *
 * @param db
 * @param body
 * @param model
 * @param res
 * @return {Promise<T>}
 */
const updateTask = (db, body, model, res) => {
  const newService = (body.serviceId !== model.serviceId);
  return db.transaction((t) => {
    return model.updateAttributes(body, {transaction: t})
      .then((data) => {
        return body.linkedCases ? data.setLinkedCases(body.linkedCases, {transaction: t}) : data;
      })
      .then(async (data) => {
        if(newService) {
          const service = await Service.findOne({
            where: {
              id: body.serviceId
            },
            transaction: t
          });

          return Resource.update({workerId: body.workerId, serviceId: body.serviceId, caseId: service ? service.caseId : null}, {where: {id: data.resourceId}, transaction: t})
            .then((resource) => ({resource, task: data }))
            .then((data) => {
              return Model.update({resourceId: data.resource.id}, {where: {id: data.task.id}, transaction: t});
            })
            .catch((err) => Promise.reject(err));
        }
      });
  }).then(function () {
    // Transaction has been committed
    res.sendStatus(204);
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
            model: Resource,
            as: 'resource'
          },
          {
            model: ContactProfile,
            as: 'worker'
          }
        ],
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
    validate(validation.tasks),
    async ({ body }, res) => {
      try {
        await createTask(db, body, res);
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
    validate(validation.tasks),
    async ({ model, body }, res) => {
      try {
        await updateTask(db, body, model, res);
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
