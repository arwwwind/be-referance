import response from '../concerns/response';
import Raven from "raven";
import {getPaginatorOptions} from '../concerns/modifiers';
import {Op} from "sequelize";
const Model = require('../../models/index').ClientUpdate;
const ContactProfile = require('../../models/index').ContactProfile;

export default async (req, res) => {
  try {
    await Model.findAndCountAll({
      distinct: true,
      include: [
        {
          model: ContactProfile,
          as: "profile"
        }
      ],
      where: {
        serviceId: req.query.serviceId,
        subject: {
          [Op.iLike]: `%${(req.query.search || "")}%`
        }
      },
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
