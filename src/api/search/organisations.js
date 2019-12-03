import response from '../concerns/response';
import Raven from "raven";
import {Op} from "sequelize";
import { collectionHandler } from "../resources/organisations";

const Model = require('../../models/index').Organisation;

export default async (req, res) => {
    try {
        await Model.findAndCountAll({
            where: {
                companyName: {
                    [Op.iLike]: `%${(req.query["search"] || "")}%`
                }
            },
            order: [
                ['id', 'DESC']
            ],
            limit: req.query.limit,
            offset: req.skip
        }).then(collectionHandler(req, res));
    } catch(err) {
        Raven.captureException(err);
        response(res).error(err, 500);
    }
};
