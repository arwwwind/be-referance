import response from "../concerns/response";
import Raven from "raven";
import {getPaginatorOptions} from "../concerns/modifiers";
const express = require('express');
const router  = express.Router();
const ServiceTag = require('../../models/index').ServiceTag;

router.get('/', async (req, res) => {
  try {
    await ServiceTag.findAndCountAll({
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
});

export default router;
