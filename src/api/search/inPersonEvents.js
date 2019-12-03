import response from '../concerns/response';
import Raven from "raven";
import {getPaginatorOptions} from '../concerns/modifiers';
import {Op} from "sequelize";
const Model = require('../../models/index').InPersonEvent;
const Case = require('../../models/index').Case;
const Venue = require('../../models/index').Venue;
const Judge = require('../../models/index').Judge;
const Service = require('../../models/index').Service;
const ContactProfile = require('../../models/index').ContactProfile;

export default async (req, res) => {
  try {
    const where = {};
    where[req.query.entity + "Id"] = req.query.entityId;
    where.description = {[Op.iLike]: `%${(req.query.search || "")}%`};
    await Model.findAndCountAll({
      where,
      distinct: true,
      include: [
        {
          model: Case,
          as: "case"
        }, {
          model: Venue,
          as: "venue"
        }, {
          model: Judge,
          as: "judge"
        }, {
          model: Service,
          as: "service"
        }, {
          model: ContactProfile,
          as: "rep"
        }, {
          model: ContactProfile,
          as: "creator"
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
};
