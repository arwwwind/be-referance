import response from "../concerns/response";
import Raven from "raven";
import validate from 'express-validation';
import validation from '../validation/index';
import { Router } from 'express';
import permission from "permission";
import config from '../../config.json';
import mail from "../concerns/mail";

const Model = require('../../models/index').Case;
const User = require('../../models/index').User;

const router  = new Router();

router.post('/:caseId/delete', permission(['user']), validate(validation.actions.cases.delete), async (req, res) => {
  try {
    const caseObj = await Model.findById(req.params.caseId);
    if(caseObj) {
      const profile = await req.user.getProfile();
      const arrayOfRecipients = (await User.findAll({where:{userType: "admin"}})).map(item => item.loginEmail);
      const url = config.appUrl + "/delete/" + req.params.caseId;
      const message = `<strong>Case name:</strong> ${caseObj.name}<br><strong>Case description:</strong> ${caseObj.description}`;
      try {
        await mail.sendRequestDelete(arrayOfRecipients, `${profile.firstName} ${profile.lastName}`, message, "case", url);
        res.sendStatus(204);
      } catch(err) {
        Raven.captureException(err);
        response(res).error(err, 500);
      }
    } else {
      res.sendStatus(404);
    }
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});

router.delete('/:caseId', permission(['admin']), validate(validation.actions.cases.delete), async (req, res) => {
  try {
    await Model.destroy({where:{id:req.params.caseId}});
    res.sendStatus(204);
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});

export default router;
