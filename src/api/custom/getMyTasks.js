import response from '../concerns/response';
import Raven from "raven";
import {getPaginatorOptions} from '../concerns/modifiers';
import {Op} from "sequelize";

const moment = require("moment");
const Model = require('../../models/index').Tasks;
const Resource = require('../../models/index').Resource;
const Service = require('../../models/index').Service;
const ContactProfile = require('../../models/index').ContactProfile;
const Organisation = require('../../models/index').Organisation;

const intervals = {
  "overdue": {
    left: moment(0),
    right: moment()
  },
  "today": {
    left: moment().startOf('day'),
    right: moment().startOf('day').add(1, 'day')
  },
  "next-7-days": {
    left: moment().startOf('day'),
    right: moment().startOf('day').add(7, 'day')
  },
};

export default async (req, res) => {
  try {
    const options = {workerId: req.user.id};
    if(req.query.filter) {
      options.dueDate= {
        [Op.and]: {
          [Op.gte]: intervals[req.query.filter]["left"],
          [Op.lte]: intervals[req.query.filter]["right"]
        }
      };
    }
    await Model.findAndCountAll({
      where: options,
      distinct: true,
      include: [
        {
          model: Resource,
          as: 'resource',
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
