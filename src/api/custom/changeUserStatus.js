import response from '../concerns/response';
import Raven from "raven";

const Model = require('../../models/index').User;

export default async (req, res) => {
  try {
    await Model.update({
      active: req.body.active
    }, {where: {id: req.params.id}}).then(() => {
      res.sendStatus(204);
    });
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
};
