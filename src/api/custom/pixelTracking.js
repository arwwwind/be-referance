import Raven from "raven";
import { Router } from 'express';
import config from '../../config'

const Model = require('../../models/index').ClientUpdate;
const moment = require('moment');

export default (type) => {
  let router = new Router();

  if(type === "clientUpdate") {
    router.get("/", async (req, res) => {
      const date = moment().format(config.dateWithTimezone);
      try {
        await Model.update({openedTime: date}, {where: {id: req.query.cuId, openedTime: null}});
      } catch(err) {
        Raven.captureException(err);
      }
      res.sendFile(appRoot + "/public/min.png");
    });
  }

  return router;
}
