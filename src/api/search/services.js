import response from '../concerns/response';
import Raven from "raven";
import {Op} from "sequelize";
import {getPaginatorOptions} from '../concerns/modifiers';

const sequelize = require('../../models/index').sequelize;
const Model = require('../../models/index').Service;
const Case = require('../../models/index').Case;
const ContactProfile = require('../../models/index').ContactProfile;
const Organisation = require('../../models/index').Organisation;

export default async (req, res) => {
  const preparedWhere = {
    [Op.or]: [
      {
        '$case.injuredWorker.firstName$': {
          [Op.iLike]: `%${(req.query.search || "")}%`
        }
      },
      {
        '$case.injuredWorker.lastName$': {
          [Op.iLike]: `%${(req.query.search || "")}%`
        }
      },
      {
        serviceType: {
          [Op.iLike]: `%${(req.query.search || "")}%`
        }
      },
      sequelize.where(
        sequelize.cast(sequelize.col('Service.id'), 'varchar'),
        {
          [Op.iLike]: `%${(req.query.search || "")}%`
        }
      )
    ]
  };

  if(req.query.caseId) {
    preparedWhere.caseId = req.query.caseId;
  }

  try {
    await Model.findAndCountAll({
      distinct: true,
      include: [
        {
          model: Case,
          as: "case",
          include: [
            {
              model: ContactProfile,
              as: 'injuredWorker',
            },
            {
              model: Organisation,
              as: 'account'
            }
          ]
        }
      ],
      where: preparedWhere,
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
