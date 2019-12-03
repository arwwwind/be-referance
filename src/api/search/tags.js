import response from '../concerns/response';
import Raven from "raven";
import { getPaginatorOptions } from '../concerns/modifiers';
import { Op } from "sequelize";
const Model = require('../../models/index').ServiceTag;

export default async (req, res) => {
  try {
    await Model.findAndCountAll({
      where: {
        label: {
          [Op.iLike]: `%${(req.query["search"] || "")}%`
        }
      },
      attributes: ['label'],
      group: ['label'],
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
