import resource from 'resource-router-middleware';
import response from '../concerns/response';
import Raven from "raven";
import crypto from 'crypto';
import util from '../../lib/util';
import mail from '../concerns/mail';
import {Op} from "sequelize";
import permission from "permission";

const Model = require('../../models/index').User;
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
          as: 'profile'
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

  /** Property name to store preloaded entity on `request`. */
  id : 'model',

  load,

  /** GET / - List all entities */
  index: [
    permission(['admin']),
    async ({ params }, res) => {
      try {
        const models = await Model.findAll({
          include: [
            {
              model: ContactProfile,
              as: 'profile'
            }
          ],
          order: [
            ['id', 'DESC']
          ]
        });

        response(res).collection(models);
      } catch(err) {
        Raven.captureException(err);
        response(res).error(err, 500);
      }
    }
  ],

  /** POST / - Create a new entity */
  create: [
    permission(['admin']),
    validate(validation.users),
    async ({ body }, res) => {
      try {
        const occurences = await Model.count({
          where: {
            loginEmail: body.loginEmail
          }
        });
        if(occurences === 0) {
          const password = crypto.randomBytes(10).toString('hex');
          const hash = await util.generateHashPassword(password);
          const profile = await ContactProfile.create({
            firstName: body.firstName,
            lastName: body.lastName
          });

          body.profileId = profile.id;
          body.password = hash;

          const model = await Model.create(body);

          try {
            await mail.sendAccountCreated(body.loginEmail, password);
          } catch (err) {
            Raven.captureException(err);
          }
          load(null, model.id, (err, data) => {
            if(err) {
              Raven.captureException(err);
              response(res).error(err, 500);
            } else {
              response(res).item(data);
            }
          });
        } else {
          response(res).error({
            loginEmail: ["This email has already been taken."]
          }, 422);
        }
      } catch(err) {
        Raven.captureException(err);
        response(res).error(err, 500);
      }
    }
  ],

  /** GET /:id - Return a given entity */
  read:[
    permission(['admin', 'user']),
    async ({ model, user }, res) => {
      if(user.userType === "admin" || user.id === model.id) {
        response(res).item(model);
      } else {
        response(res).unauthorized("You are not authorized to access this resource.");
      }
    }
  ],

  /** PUT /:id - Update a given entity */
  update: [
    permission(['admin']),
    validate(validation.users),
    async ({ model, body }, res) => {
      try {
        const occurences = await Model.count({
          where: {
            [Op.and]: {
              loginEmail: body.loginEmail,
              id: {
                [Op.ne]: model.id
              }
            }
          }
        });
        if(occurences === 0) {
          await model.updateAttributes(body);

          const profile = await ContactProfile.findById(model.profileId);
          profile.firstName = body.firstName;
          profile.lastName = body.lastName;
          await profile.save();

          res.sendStatus(204);
        } else {
          response(res).error({
            loginEmail: ["This email has already been taken."]
          }, 422);
        }
      } catch(err) {
        response(res).error(err, 422);
      }
    }
  ],

  /** DELETE /:id - Delete a given entity */
  delete: [
    permission(['admin']),
    async ({model, user}, res) => {
      response(res).error('This entity does not support this operation.', 400);
    }
  ]
});
