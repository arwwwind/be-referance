import response from "../concerns/response";
import Raven from "raven";
import validate from 'express-validation';
import validation from '../validation/index';
import { Router } from 'express';
import permission from "permission";
import config from '../../config.json';
import mail from "../concerns/mail";
import constants from "../../config/constants";
import {getPaginatorOptions} from "../concerns/modifiers";

const Model = require('../../models/index').Service;
const ServiceActions = require('../../models/index').ServiceActions;
const Case = require('../../models/index').Case;
const Service = require('../../models/index').Service;
const Claim = require('../../models/index').Claim;
const Organisation = require('../../models/index').Organisation;
const ContactProfile = require('../../models/index').ContactProfile;
const User = require('../../models/index').User;
const moment = require('moment');

let router  = new Router();

router.get('/list', permission(['user', 'admin']), async (req, res) => {
  try {
    await Model.findAll({
      include: [
        {
          model: Case,
          as: "case",
          where: {
            deletedAt: null
          },
          include: [
            {
              model: ContactProfile,
              as: 'injuredWorker'
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
              as: 'services'
            },
            {
              model: Claim,
              as: 'claims'
            }
          ]
        }
      ],
      order: [
        ['id', 'DESC']
      ],
      limit: req.query.limit
    }).then(results => {
      results = results.map(item => ({id: item.id, name: `${item.case.name} - ${item.serviceType} - ${item.description}` }));
      response(res).item({rows: results});
    });
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});
router.get('/:serviceId', permission(['user', 'admin']), validate(validation.actions.services.reason), async (req, res) => {
  try {
    await ServiceActions.findAndCountAll({
      distinct: true,
      include: [
        {
          model: Model,
          as: "service",
        }, {
          model: ContactProfile,
          as: "profile",
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
      results = results.rows.map(item => ({id: item.id, name: `${item.case.name} - ${item.serviceType}` }));
      response(res).item(results);
    });
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});
router.get('/:serviceId/:action', permission(['user', 'admin']), validate(validation.actions.services.listActions), async (req, res) => {
  try {
    await ServiceActions.findAndCountAll({
      distinct: true,
      include: [
        {
          model: Model,
          as: "service",
        }, {
          model: ContactProfile,
          as: "profile",
        }
      ],
      where: {
        action: req.params.action
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
});
router.post('/:serviceId/suspend', permission(['user', 'admin']), validate(validation.actions.services.reason), async (req, res) => {
  try {
    Model.update({suspended: true, suspendReason: req.body.reason}, {where:{id:req.params.serviceId}});
    ServiceActions.create({
      serviceId: req.params.serviceId,
      profileId: req.user.profileId,
      action: "suspend",
      startDate: moment().format(config.dateWithTimezone),
      reason: req.body.reason
    });
    res.sendStatus(204);
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});
router.post('/:serviceId/unsuspend', permission(['user', 'admin']), validate(validation.actions.services.list), async (req, res) => {
  try {
    Model.update({suspended: false, suspendReason: null}, {where:{id:req.params.serviceId}});
    ServiceActions.update({endDate: moment().format(config.dateWithTimezone)}, {where: {serviceId: req.params.serviceId, action: "suspend", endDate: null}});
    res.sendStatus(204);
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});
router.post('/:serviceId/hold', permission(['user', 'admin']), validate(validation.actions.services.reason), async (req, res) => {
  try {
    Model.update({onHold: true, holdReason: req.body.reason}, {where:{id:req.params.serviceId}});
    ServiceActions.create({
      serviceId: req.params.serviceId,
      profileId: req.user.profileId,
      action: "hold",
      startDate: moment().format(config.dateWithTimezone),
      reason: req.body.reason
    });
    res.sendStatus(204);
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});
router.post('/:serviceId/unhold', permission(['user', 'admin']), validate(validation.actions.services.list), async (req, res) => {
  try {
    Model.update({onHold: false, holdReason: null}, {where:{id:req.params.serviceId}});
    ServiceActions.update({endDate: moment().format(config.dateWithTimezone)}, {where: {serviceId: req.params.serviceId, action: "hold", endDate: null}});
    res.sendStatus(204);
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});
router.post('/:serviceId/cancel', permission(['user', 'admin']), validate(validation.actions.services.reason), async (req, res) => {
  try {
    Model.update({status: "cancelled", cancelReason: req.body.reason}, {where:{id:req.params.serviceId}});
    ServiceActions.create({
      serviceId: req.params.serviceId,
      profileId: req.user.profileId,
      action: "cancel",
      startDate: moment().format(config.dateWithTimezone),
      reason: req.body.reason
    });
    res.sendStatus(204);
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});
router.post('/:serviceId/activate', permission(['user', 'admin']), validate(validation.actions.services.list), async (req, res) => {
  try {
    Model.update({status: "active", cancelReason: null}, {where:{id:req.params.serviceId}});
    ServiceActions.update({endDate: moment().format(config.dateWithTimezone)}, {where: {serviceId: req.params.serviceId, action: "cancel", endDate: null}});
    res.sendStatus(204);
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});

router.post('/:serviceId/delete', permission(['user']), validate(validation.actions.services.delete), async (req, res) => {
  try {
    const service = await Model.findById(req.params.serviceId);
    const caseObj = await Case.findById(service.caseId);
    if(caseObj && service) {
      const profile = await req.user.getProfile();
      const arrayOfRecipients = (await User.findAll({where:{userType: "admin"}})).map(item => item.loginEmail);
      const url = config.appUrl + "/delete/" + service.caseId + "/service/" + req.params.serviceId;
      const message = "<strong>Case name:</strong> " + caseObj.name +
        "<br><strong>Case description:</strong> " + caseObj.description +
        "<br><strong>Service description:</strong> " + service.description +
        "<br><strong>Service type:</strong> " + constants.serviceTypesLabels[service.serviceType];
      try {
        await mail.sendRequestDelete(arrayOfRecipients, `${profile.firstName} ${profile.lastName}`, message, "service", url);
        res.sendStatus(204);
      } catch(err) {
        Raven.captureException(err);
        response(res).error(err, 500);
      }
    } else {
      res.sendStatus(404);
    }
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});
router.delete('/:serviceId', permission(['admin']), validate(validation.actions.services.delete), async (req, res) => {
  try {
    await Model.destroy({where:{id:req.params.serviceId}});
    res.sendStatus(204);
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});

export default router;
