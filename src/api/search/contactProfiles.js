import response from '../concerns/response';
import Raven from "raven";
import {getPaginatorOptions} from '../concerns/modifiers';
import {Op} from "sequelize";
const Model = require('../../models/index').ContactProfile;
const User = require('../../models/index').User;
const Organisation = require('../../models/index').Organisation;

export default async (req, res) => {
  const includeAndOrder = {
    order: [],
    distinct: true,
    include: [
      {
        model: User,
        as: 'user'
      }
    ]
  };
  if(req.query.sortId && req.query.sortOrder) {
    switch(req.query.sortId) {
      case "name":
        includeAndOrder["order"].push(['firstName', req.query.sortOrder]);
        break;
      case "primary":
        includeAndOrder["order"].push(['primaryPhoneNumberType', req.query.sortOrder]);
        break;
      case "secondary":
        includeAndOrder["order"].push(['secondaryPhoneNumberType', req.query.sortOrder]);
        break;
      case "fax":
        includeAndOrder["order"].push(['faxNumber', req.query.sortOrder]);
        break;
      case "organization":
        includeAndOrder["include"].push({
          model: Organisation,
          as: 'organisation',
          order: [
            ["companyName", req.query.sortOrder]
          ]
        });
        break;
      case "organizationTerritory":
        includeAndOrder["include"].push({
          model: Organisation,
          as: 'organisation',
          order: [
            ["territory", req.query.sortOrder]
          ]
        });
        break;
      case "linkedUser":
      case "daysSinceLastReferral":
        includeAndOrder["order"].push(['id', "DESC"]);
        break;
      default:
        includeAndOrder["order"].push([req.query.sortId, req.query.sortOrder]);
    }
  } else {
    includeAndOrder["order"].push(['id', 'DESC']);
    includeAndOrder["include"].push({
      model: Organisation,
      as: 'organisation'
    });
  }
  try {
    await Model.findAndCountAll({
      ...includeAndOrder,
      where: {
        [Op.or]: [
          {
            firstName: {
              [Op.iLike]: `%${(req.query["search"] || "")}%`
            }
          },
          {
            lastName: {
              [Op.iLike]: `%${(req.query["search"] || "") }%`
            }
          }
        ]
      },
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
