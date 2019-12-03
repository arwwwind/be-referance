import response from "../concerns/response";
import Raven from "raven";
import validate from 'express-validation';
import validation from '../validation/index';
import {Op} from "sequelize";
import { Router } from 'express';
const Model = require('../../models/index').Track;

/**
 * Creates a transaction in the db, in order to create a track
 *
 * @param db
 * @param model
 * @param body
 * @param options
 * @param res
 * @return {Promise<T>}
 */
const moveTrack = (db, model, body, options, res) => {
  return db.transaction((t) => {
    return model.updateAttributes({position: body.newPosition, phase: body.newPhase}, {transaction: t})
      .then((data) => {
        const promises = [];
        if(body.newPhase !== options.oldPhase) {
          /**
           * All the bigger indexes (compared to the new position) increment by 1
           */
          promises.push(Model.update({position: db.literal('position +1')}, {where: {
              [Op.and]: [
                {
                  phase: body.newPhase
                },
                {
                  position: {
                    [Op.gte]: body.newPosition
                  }
                },
                {
                  id: {
                    [Op.ne]: data.id
                  }
                }
              ]
            }, transaction: t}));
          /**
           * All the bigger indexes (compared to the last position) decrease by 1
           */
          promises.push(Model.update({position: db.literal('position -1')}, {where: {
              [Op.and]: [
                {
                  phase: options.oldPhase
                },
                {
                  position: {
                    [Op.gte]: options.oldPosition
                  }
                }
              ]
            }, transaction: t}));
        } else if(body.newPosition > options.oldPosition) {
          /**
           * All the smaller indexes (compared to the new position) and bigger to the last position, decrease by 1
           */
          promises.push(Model.update({position: db.literal('position -1')}, {where: {
              [Op.and]: [
                {
                  phase: body.newPhase
                },
                {
                  position: {
                    [Op.and]: [
                      {
                        [Op.lte]: body.newPosition
                      },
                      {
                        [Op.gt]: options.oldPosition
                      }
                    ]
                  }
                },
                {
                  id: {
                    [Op.ne]: data.id
                  }
                }
              ]
            }, transaction: t}));
        } else if(body.newPosition < options.oldPosition) {
          /**
           * All the bigger indexes (compared to the new position) and smaller to the last position, increase by 1
           */
          promises.push(Model.update({position: db.literal('position +1')}, {where: {
              [Op.and]: [
                {
                  phase: body.newPhase
                },
                {
                  position: {
                    [Op.and]: [
                      {
                        [Op.gte]: body.newPosition
                      },
                      {
                        [Op.lt]: options.oldPosition
                      }
                    ]
                  }
                },
                {
                  id: {
                    [Op.ne]: data.id
                  }
                }
              ]
            }, transaction: t}));
        }
        return Promise.all(promises).then(() => data).catch((err) => Promise.reject(err));
      });
  }).then(function (result) {
    // Transaction has been committed
    response(res).item(result);
  }).catch(function (err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  });
};

export default (db) => {
  let router  = new Router();
  router.post('/:entityId/move', validate(validation.tracks.move), async (req, res) => {
    try {
      const model = await Model.findById(req.params.entityId);
      if(model) {
        await moveTrack(db, model, req.body, {oldPhase: model.phase, oldPosition: model.position}, res)
      } else {
        res.sendStatus(404);
      }
    } catch(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  });
  return router;
};
