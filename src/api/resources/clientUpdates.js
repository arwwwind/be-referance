import resource from 'resource-router-middleware';
import response from '../concerns/response';
import Raven from "raven";
import { getPaginatorOptions } from "../concerns/modifiers";
import mail from "../concerns/mail";

const Model = require('../../models/index').ClientUpdate;
const Service = require('../../models/index').Service;
const ContactProfile = require('../../models/index').ContactProfile;
const moment = require('moment');

const DocumentPreparation = require('../../models/index').DocumentPreparation;
const EDDLien = require('../../models/index').EDDLien;
const InjuredWorkerInformation = require('../../models/index').InjuredWorkerInformation;
const InjuredWorkerOutreach = require('../../models/index').InjuredWorkerOutreach;
const LienService = require('../../models/index').LienService;
const Walkthrough = require('../../models/index').Walkthrough;
const Misc = require('../../models/index').Misc;
const serviceModels = {
  documentPreparation: DocumentPreparation,
  eddLien: EDDLien,
  injuredWorkerInformation: InjuredWorkerInformation,
  injuredWorkerOutreach: InjuredWorkerOutreach,
  lienService: LienService,
  walkthrough: Walkthrough,
  misc: Misc
};

/**
 * For requests with an `id`, you can auto-load the entity.
 *  Errors terminate the request, success sets `req[id] = data`.
 */
const load = async (req, id, callback) => {
  try {
    const model = await Model.findById(id);

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
  async index(req, res) {
    try {
      await Model.findAndCountAll({
        distinct: true,
        include: [
          {
            model: ContactProfile,
            as: "profile"
          }
        ],
        where: {
          serviceId: req.params.serviceId
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
  },

  /** POST / - Create a new entity */
  create: [
    validate(validation.clientUpdates.create),
    async (req, res) => {
      const { body, params } = req;
      try {
        const service = await Service.findById(params.serviceId);
        const serviceModelInfo = await serviceModels[service.serviceType].findById(service[service.serviceType + "Id"]);
        const updateDue = serviceModelInfo.updateIntervalMonths ?
          moment().add(serviceModelInfo.updateIntervalMonths, "week").format(config.dateWithTimezone) :
          moment().format(config.dateWithTimezone);

        const model = await Model.create({
          ...body, serviceId: params.serviceId, profileId: req.user.profileId, updateDue
        });
        if(model.id) {
          try {
            await mail.sendClientUpdate(body, req.user.loginEmail, {pixelPath: "/client-update?cuId=" + model.id});
            response(res).item(model);
          } catch(err) {
            Raven.captureException(err);
            response(res).error(err, 500);
          }
        }
      } catch(err) {
        response(res).error(err, 422);
      }
    }
  ],

  /** GET /:id - Return a given entity */
  read({ model }, res) {
    response(res).item(model);
  },

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
