import response from "../concerns/response";
import Raven from "raven";
import validate from 'express-validation';
import validation from '../validation/index';
import {getPaginatorOptions} from "../concerns/modifiers";
import {Op} from "sequelize";

const express = require('express');
const router  = express.Router();
const Model = require('../../models/index').InPersonEvent;
const Service = require('../../models/index').Service;
const Case = require('../../models/index').Case;
const Claim = require('../../models/index').Claim;
const Venue = require('../../models/index').Venue;
const Judge = require('../../models/index').Judge;
const Organisation = require('../../models/index').Organisation;
const ContactProfile = require('../../models/index').ContactProfile;

const getWhereAndIncludeFields = (req) => {
  const whereAndInclude = {
    distinct: true,
    include: [
      {
        model: Case,
        as: "case",
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
      }, {
        model: Venue,
        as: "venue"
      }, {
        model: Judge,
        as: "judge"
      }, {
        model: ContactProfile,
        as: "rep"
      }, {
        model: ContactProfile,
        as: "creator"
      }
    ],
    where: {}
  };
  if(req.query.search) {
    whereAndInclude["where"]["description"] = {
      [Op.iLike]: `%${req.query.search || ""}%`
    };
  }
  if(req.query.venueId) {
    whereAndInclude["where"]["venueId"] = req.query.venueId;
  }
  if(req.query.repConfirmed) {
    whereAndInclude["where"]["resourceConfirmed"] = !!req.query.repConfirmed;
  }
  if(req.query.serviceType) {
    whereAndInclude["include"].push({
      model: Service,
      as: "service",
      where: {
        serviceType: req.query.serviceType
      }
    });
  }
  return whereAndInclude;
};

const getEvents = (req) => Model.findAndCountAll({
  ...getWhereAndIncludeFields(req),
  order: [
    ['id', 'DESC']
  ],
  limit: req.query.limit,
  offset: req.skip
});

router.get('/', validate(validation.inPersonEvents.calendar), async (req, res) => {
  try {
    const results = await getEvents(req);
    response(res).collectionPaginated(getPaginatorOptions(req, results));
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});

export default router;
