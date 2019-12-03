import response from "../concerns/response";
import Raven from "raven";
import {getPaginatorOptions} from "../concerns/modifiers";
import validate from 'express-validation';
import validation from '../validation/index';
import {Op} from "sequelize";

const express = require('express');
const router  = express.Router();
const _ = require('lodash');

const Model = require('../../models/index').Case;
const InPersonEvent = require('../../models/index').InPersonEvent;
const Service = require('../../models/index').Service;
const Claim = require('../../models/index').Claim;
const ContactProfile = require('../../models/index').ContactProfile;
const Organisation = require('../../models/index').Organisation;

const getJudgeCaseIdsArray = async (judgeId) => {
  const inPersonEventsPromise = await InPersonEvent.findAll({
    where: {
      judgeId
    }
  }).then(results => results.map(item => item.caseId));
  const servicesPromise = await Service.findAll({
    where: {
      judgeId
    }
  }).then(results => results.map(item => item.caseId));
  return _.union(inPersonEventsPromise, servicesPromise);
};

const getEntityRelatedConditions = async (req) => {
  switch(req.params.entity) {
    case "contact":
      return [
        {
          managingAdjusterId: req.params.entityId
        },
        {
          referredByAdjusterId: req.params.entityId
        },
        {
          injuredWorkerId: req.params.entityId
        }
      ];
    case "venue":
      return [
      ];
    case "organisation":
      return [
        {
          accountId: req.params.entityId
        }
      ];
    case "judge":
      const caseIds = await getJudgeCaseIdsArray(req.params.entityId);
      return [
        {
          id: {
            [Op.in]: caseIds
          }
        }
      ];
    default:
      return [];
  }
};

const buildWhereClause = async (req) => {
  const entityRelatedConditions = await getEntityRelatedConditions(req);
  const where = {
    [Op.or]: [
      {
        name: {
          [Op.iLike]: `%${(req.query.search || "")}%`
        }
      }
    ]
  };

  if(entityRelatedConditions.length) {
    where[Op.and] = {
      [Op.or]: entityRelatedConditions
    }
  }

  return where;
};

const buildServiceWhereClause = async (req) => {
  if(req.params.entity === 'venue') {
    return {
      [Op.or]: [
        {
          venueId: req.params.entityId
        },
        {
          actualVenueId: req.params.entityId
        }
      ]
    }
  }

  return undefined;
};

const getCases = async (req) => Model.findAndCountAll({
  where: await buildWhereClause(req),
  order: [
    ['id', 'DESC']
  ],
  distinct: true,
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
      as: 'services',
      required: req.params.entity === 'venue',
      where: await buildServiceWhereClause(req)
    },
    {
      model: Claim,
      as: 'claims'
    }
  ],
  limit: req.query.limit,
  offset: req.skip
});

router.get('/:entity/:entityId', validate(validation.caseLists), async (req, res) => {
  console.log(await getEntityRelatedConditions(req));
  try {
    const results = await getCases(req);
    response(res).collectionPaginated(getPaginatorOptions(req, results));
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});

export default router;
