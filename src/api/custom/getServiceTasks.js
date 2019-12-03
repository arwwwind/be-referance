import response from '../concerns/response';
import Raven from "raven";
import {getPaginatorOptions} from '../concerns/modifiers';
import {Op} from "sequelize";

const Model = require('../../models/index').Tasks;
const Service = require('../../models/index').Service;
const Resource = require('../../models/index').Resource;
const ContactProfile = require('../../models/index').ContactProfile;
const Organisation = require('../../models/index').Organisation;

export default async (req, res) => {
  try {
    await Model.findAndCountAll({
      distinct: true,
      include: [
        {
          model: Resource,
          as: "resource",
          where: {
            serviceId: req.query.serviceId
          },
          include: [
            {
              model: Service,
              as: "service"
            }
          ]
        },
        {
          model: ContactProfile,
          as: 'worker',
          include: [
            {
              model: Organisation,
              as: "organisation"
            }
          ]
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
}
