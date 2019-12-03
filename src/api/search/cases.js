import response from '../concerns/response';
import Raven from "raven";
import {getPaginatorOptions} from '../concerns/modifiers';
import {Op} from "sequelize";

const Model = require('../../models/index').Case;
const ContactProfile = require('../../models/index').ContactProfile;
const Claim = require('../../models/index').Claim;
const Service = require('../../models/index').Service;
const Organisation = require('../../models/index').Organisation;

export default async (req, res) => {
  try {
    await Model.findAndCountAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${(req.query.search || "")}%`
            }
          }
        ]
      },
      distinct: true,
      include: [
        {
          model: ContactProfile,
          as: 'injuredWorker',
          required: true
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
