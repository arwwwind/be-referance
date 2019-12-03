import response from "../concerns/response";
import Raven from "raven";
import {getPaginatorOptions} from "../concerns/modifiers";
import validate from 'express-validation';
import validation from '../validation/index';
import {Op} from "sequelize";

const express = require('express');
const router  = express.Router();
const Model = require('../../models/index').Judge;
const Venue = require('../../models/index').Venue;

const getOpOrFields = (req) => ({
  venue: [
    {
      venueId: req.params.entityId
    }
  ]
});

const getWhereFields = (req) =>
  req.query.search ? {
    [Op.and]: [
      {
        [Op.or]: getOpOrFields(req)[req.params.entity],
      },
      {
        [Op.or]: [
          {
            firstName: {
              [Op.iLike]: `%${req.query.search || ""}%`,
            }
          },
          {
            lastName: {
              [Op.iLike]: `%${req.query.search || ""}%`,
            }
          }
        ]
      }
    ]} : {[Op.or]: getOpOrFields(req)[req.params.entity]};

const getJudges = (req) => Model.findAndCountAll({
  where: getWhereFields(req),
  distinct: true,
  include: [
    {
      model: Venue,
      as: "venue"
    }
  ],
  order: [
    ['id', 'DESC']
  ],
  limit: req.query.limit,
  offset: req.skip
});

router.get('/:entity/:entityId', validate(validation.judgeLists), async (req, res) => {
  try {
    const results = await getJudges(req);
    response(res).collectionPaginated(getPaginatorOptions(req, results));
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});

export default router;
