import resource from 'resource-router-middleware';
import response from '../concerns/response';
import Raven from "raven";
import {parseName, getPaginatorOptions} from "../concerns/modifiers";

const Model = require('../../models/index').Judge;
const Venue = require('../../models/index').Venue;

const prepareBodyName = (body) => {
    if(body.name) {
        const name = parseName(body.name);
        body.firstName = name.firstName;
        body.lastName = name.lastName;
    }
};

/**
 * For requests with an `id`, you can auto-load the entity.
 *  Errors terminate the request, success sets `req[id] = data`.
 */
const load = async (req, id, callback) => {
    try {
        const model = await Model.findById(id, {
          include: [
            {
              model: Venue,
              as: 'venue'
            }
          ]
        });

        if(model) {
            callback(null, model);
        } else {
            callback(response(null).error('Not found', 404));
        }
    } catch(err) {
        Raven.captureException(err);
        callback(response(null).error('Internal server error', 500));
    }
};

export default ({ config, db, validate, validation }) => resource({

    /** Property name to store preloaded entity on `request`. */
    id : 'model',

    load,

    /** GET / - List all entities */
    async index(req, res) {
        try {
            await Model.findAndCountAll({
                distinct: true,
                include: [
                    {
                        model: Venue,
                        as: 'venue'
                    }
                ],
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
    },

    /** POST / - Create a new entity */
    create: [
        validate(validation.judges),
        async ({ body }, res) => {
            try {
                prepareBodyName(body);
                body.active = true;
                const model = await Model.create(body);

                load(null, model.id, (err, data) => {
                    if(err) {
                        Raven.captureException(err);
                        response(res).error(err, 500);
                    } else {
                        response(res).item(data);
                    }
                });
            } catch(err) {
                response(res).error(err, 422);
            }
        }
    ],

    /** GET /:id - Return a given entity */
    read({ model }, res) {
        response(res).item(model);
    },

    /** PUT /:id - Update a given entity */
    update: [
        validate(validation.judges),
        async ({ model, body }, res) => {
            try {
                prepareBodyName(body);
                await model.updateAttributes(body);
                res.sendStatus(204);
            } catch(err) {
                response(res).error(err, 422);
            }
        }
    ],

    /** DELETE /:id - Delete a given entity */
    async delete({ model }, res) {
        try {
            await model.destroy();
            res.sendStatus(204);
        } catch(err) {
            Raven.captureException(err);
            response(res).error(err, 500);
        }
    }
});
