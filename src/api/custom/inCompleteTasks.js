import response from '../concerns/response';
import moment from "moment";
import Raven from "raven";

const Tasks = require('../../models/index').Tasks;

export default async (req, res) => {
  try {
    const task = await Tasks.findOne({
      where: {
        id: req.params.id
      }
    });

    if(task) {
      if(task.endedOn) {
        task.endedOn = null;
        await task.save();
      }

      return response(res).item(task);
    }

    res.status(404).json(response(null).error('Not found'));
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
}
