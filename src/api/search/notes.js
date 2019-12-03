import response from '../concerns/response';
import Raven from "raven";
import {getPaginatorOptions} from '../concerns/modifiers';
import {Op} from "sequelize";

const Model = require('../../models/index').Notes;
const models = {
    case: require('../../models/index').Case,
    service: require('../../models/index').Service
};

export default async (req, res) => {
    try {
        const model = await models[req.query.entityType].findOne({
            where: {
                id: req.query.entityId
            }
        });
        const notesIdArray = await model.getNotes().map(item => item.id);
        await Model.findAndCountAll({
            where: {
                id: {
                    [Op.in]: notesIdArray
                },
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
