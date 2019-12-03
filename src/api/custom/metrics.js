import response from "../concerns/response";
import Raven from "raven";
import validate from 'express-validation';
import validation from '../validation/index';

const express = require('express');
const router  = express.Router();

import getCaseMetrics from './metrics/case';
import getContactMetrics from './metrics/contact';
import getDashboardMetrics from './metrics/dashboardMetrics';

import getContactOverview from './metrics/contactOverview';
import getVenueOverview from './metrics/venueOverview';
import getJudgeOverview from './metrics/judgeOverview';
import getOrganisationOverview from './metrics/organisationOverview';
import getLienServiceOverview from './metrics/lienServiceOverview';

router.get('/:entity/:entityId', validate(validation.metrics.all), async (req, res) => {
  try {
    let results = {};
    switch(req.params.entity) {
      case "contact":
        results = await getContactMetrics(req);
        break;
      case "case":
        results = await getCaseMetrics(req);
        break;
      case "dashboard":
        results = await getDashboardMetrics(req);
        break;
    }
    response(res).item(results);
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});

router.get('/:entity/:entityId/overview', validate(validation.metrics.overview), async (req, res) => {
  try {
    let results = {};
    switch(req.params.entity) {
      case "contact":
        results = await getContactOverview(req);
        break;
      case "venue":
        results = await getVenueOverview(req);
        break;
      case "judge":
        results = await getJudgeOverview(req);
        break;
      case "organisation":
        results = await getOrganisationOverview(req);
        break;
      case "lien":
        results = await getLienServiceOverview(req);
        break;
    }
    response(res).item(results);
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});

export default router;
