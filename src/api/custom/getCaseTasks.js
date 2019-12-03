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
    const options = {caseId: req.query.caseId};
    if(req.query.serviceType) {
      const services = await Service.findAll({
        where: {
          caseId: req.query.caseId,
          serviceType: req.query.serviceType
        }
      });
      options.serviceId = {
        [Op.in]: services.map(item => item.id)
      };
    }
    await Model.findAndCountAll({
      distinct: true,
      include: [
        {
          model: Resource,
          as: "resource",
          where: options,
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
};
