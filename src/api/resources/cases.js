import resource from 'resource-router-middleware';
import response from '../concerns/response';
import Raven from "raven";
import { getPaginatorOptions } from "../concerns/modifiers";
import {Op} from "sequelize";
import config from '../../config';

const _ = require('lodash');
const moment = require('moment');
const Model = require('../../models/index').Case;
const Claim = require('../../models/index').Claim;
const ContactProfile = require('../../models/index').ContactProfile;
const Organisation = require('../../models/index').Organisation;
const Service = require('../../models/index').Service;
const DocumentPreparation = require('../../models/index').DocumentPreparation;
const EDDLien = require('../../models/index').EDDLien;
const Lien = require('../../models/index').Lien;
const InjuredWorkerInformation = require('../../models/index').InjuredWorkerInformation;
const InjuredWorkerOutreach = require('../../models/index').InjuredWorkerOutreach;
const LienService = require('../../models/index').LienService;
const Walkthrough = require('../../models/index').Walkthrough;
const Misc = require('../../models/index').Misc;
const Venue = require('../../models/index').Venue;
const Judge = require('../../models/index').Judge;
const ServiceTag = require('../../models/index').ServiceTag;

/**
 * For requests with an `id`, you can auto-load the entity.
 *  Errors terminate the request, success sets `req[id] = data`.
 */
const load = async (req, id, callback) => {
  try {
    const model = await Model.findById(id, {
      include: [
        {
          model: Claim,
          as: 'claims'
        },
        {
          model: ContactProfile,
          as: 'injuredWorker',
          include: [
            {
              model: Organisation,
              as: 'organisation'
            }
          ]
        },
        {
          model: Organisation,
          as: 'account'
        },
        {
          model: ContactProfile,
          as: 'referral'
        },
        {
          model: ContactProfile,
          as: 'caseOwner'
        },
        {
          model: Service,
          as: 'services',
          include: [
            {
              model: DocumentPreparation,
              as: 'documentPreparation'
            },
            {
              model: EDDLien,
              as: 'eddLien'
            },
            {
              model: InjuredWorkerInformation,
              as: 'injuredWorkerInformation'
            },
            {
              model: InjuredWorkerOutreach,
              as: 'injuredWorkerOutreach'
            },
            {
              model: LienService,
              as: 'lienService'
            },
            {
              model: Walkthrough,
              as: 'walkthrough'
            },
            {
              model: Misc,
              as: 'misc'
            },
            {
              model: ServiceTag,
              as: 'tags'
            },
            {
              model: Claim,
              as: 'claims'
            },
            {
              model: ContactProfile,
              as: 'invoicer'
            },
            {
              model: ContactProfile,
              as: 'serviceOwner'
            },
            {
              model: ContactProfile,
              as: 'referredBy'
            },
            {
              model: ContactProfile,
              as: 'currentClaimHandler'
            },
            {
              model: Venue,
              as: 'venue'
            },
            {
              model: Venue,
              as: 'actualVenue'
            },
            {
              model: Judge,
              as: 'judge'
            },
            {
              model: ContactProfile,
              as: 'applicantAttorney'
            }
          ]
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
 * Creates a transaction in the db, in order to create a case
 *
 * @param db
 * @param req
 * @param res
 * @return {Promise<T>}
 */
const createCase = (db, req, res) => {
  const { body } = req;

  return db.transaction((t) => {
    return Model.create(body, {transaction: t})
      .then((data) => {
        const promises = [];
        if(!_.isEmpty(body.claims)) {
          for(const claim of body.claims) {
            promises.push(Claim.create({...claim, caseId: data.id}, {transaction: t}));
          }
        }
        return Promise.all(promises).then(() => (data)).catch(err => Promise.reject(err));
      });
  }).then(function (result) {
    load(req, result.id, (err, model) => response(res).item(model));
  }).catch(function (err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  });
};

/**
 * Creates a transaction in the db, in order to update a case
 *
 * @param db
 * @param model
 * @param body
 * @param claimIdsArray
 * @param res
 * @return {Promise<T>}
 */
const updateCase = (db, model, body, claimIdsArray, res) => {
  const newReferralId = (model.referralId !== body.referralId);
  return db.transaction((t) => {
    return model.updateAttributes(body, {transaction: t})
      .then((data) => {
        const promises = [];
        if(!_.isEmpty(body.claims)) {
          for(const claim of body.claims) {
            /** If i receive an id which is present in the database, i update*/
            if(claimIdsArray.indexOf(claim.id) !== -1) {
              delete claimIdsArray[claimIdsArray.indexOf(claim.id)];
              promises.push(Claim.update({...claim, caseId: data.id}, {where: {id: claim.id}, transaction: t}));
              /** If i do not receive an id, i create*/
            } else {
              promises.push(Claim.create({...claim, caseId: data.id}, {transaction: t}));
            }
          }
        }
        /** Delete the remaining claims, which are not in the body */
        for(const remainingId of claimIdsArray) {
          promises.push(Claim.destroy({where: {id: remainingId}}, {transaction: t}));
        }
        return Promise.all(promises);
      })
      .then((data) => {
        const promises = [];
        if(newReferralId) {
          promises.push(Model.update({adjusterUpdatedAt: moment().format(config.dateWithTimezone)},{where:{id: model.id}, transaction: t}));
        }
        return Promise.all(promises).then(() => data).catch((err) => Promise.reject(err));
      });
  }).then(function () {
    // Transaction has been committed
    res.sendStatus(204);
  }).catch(function (err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  });
};

const getCasesCollection = async (req) => {
  const options = {
    include: [
      {
        model: ContactProfile,
        as: 'referral'
      },
      {
        model: ContactProfile,
        as: 'caseOwner'
      },
      {
        model: ContactProfile,
        as: 'injuredWorker'
      },
      {
        model: Organisation,
        as: 'account'
      },
      {
        model: Claim,
        as: 'claims'
      }
    ],
    order: [
      ['id', 'DESC']
    ]
  };
  if(req.query.quickView) {
    switch(req.query.quickView) {
      case "order_referral_date":
        options.order = [['referralDate', 'DESC']];
        options.include.push({
          model: Service,
          as: 'services'
        });
        break;
      case "cases_with_edd_lien":
        options.include.push({
          model: Service,
          as: "services",
          where: {
            serviceType: "eddLien"
          }
        });
        break;
      case "cases_with_lien":
        const serviceIds = await Lien.findAll().map(item => item.serviceId);
        options.include.push({
          model: Service,
          as: "services",
          where: {
            id: {
              [Op.in]: serviceIds
            }
          }
        });
        break;
      default:
        break;
    }
  } else {
    options.include.push({
      model: Service,
      as: 'services'
    });
  }
  const count = (await Model.findAll(options)).length;
  const results = await Model.findAndCountAll({
    ...options,
    limit: req.query.limit,
    offset: req.skip
  });

  return {...results, count};
};

export default ({ config, db, validate, validation }) => resource({

  /** Property name to store preloaded entity on `request`. */
  id : 'model',

  load,

  /** GET / - List all entities */
  index: [
    validate(validation.cases.index),
    async (req, res) => {
      try {
        const results = await getCasesCollection(req);
        response(res).collectionPaginated(getPaginatorOptions(req, results));
      } catch(err) {
        Raven.captureException(err);
        response(res).error(err, 500);
      }
    }
  ],

  /** POST / - Create a new entity */
  create: [
    validate(validation.cases.create),
    async (req, res) => {
      try {
        await createCase(db, req, res);
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
    validate(validation.cases.create),
    async ({ model, body }, res) => {
      try {
        const claimIdsArray = model.claims.map(claim => claim.id);
        await updateCase(db, model, body, claimIdsArray, res);
      } catch(err) {
        response(res).error(err, 422);
      }
    }
  ]
});
