import response from '../concerns/response';
import Raven from "raven";
import {getPaginatorOptions} from '../concerns/modifiers';
import {Op} from "sequelize";
const Model = require('../../models/index').Lien;
const Organisation = require('../../models/index').Organisation;

export default async (req, res) => {
  try {
    await Model.findAndCountAll({
      where: {
        serviceId: req.query.serviceId
      },
      distinct: true,
      include: [
        {
          model: Organisation,
          as: 'claimentName',
          where: {
            companyName: {
              [Op.iLike]: `%${(req.query.search || "")}%`
            }
          }
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
