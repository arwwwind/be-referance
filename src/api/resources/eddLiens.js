import resource from 'resource-router-middleware';
import response from '../concerns/response';
import Raven from "raven";
import { getPaginatorOptions } from "../concerns/modifiers";

const _ = require('lodash');
const Model = require('../../models/index').EDDLien;
const Service = require('../../models/index').Service;
const EDDLiensPeriod = require('../../models/index').EDDLiensPeriod;
const ContactProfile = require('../../models/index').ContactProfile;

/**
 * For requests with an `id`, you can auto-load the entity.
 *  Errors terminate the request, success sets `req[id] = data`.
 */
const load = async (req, id, callback) => {
    try {
        const model = await Model.findById(id, {
            include: [
                {
                    model: Service,
                    as: "service"
                },
                {
                    model: EDDLiensPeriod,
                    as: "periods"
                },
                {
                    model: ContactProfile,
                    as: "eddRep"
                }
            ],
          order: [
            [{ model: EDDLiensPeriod, as: 'periods' }, 'id', 'asc']
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

/**
 * Returns the promises for all periods
 * updates, creates or deletes EDDLiensPeriods
 *
 * @param data
 * @param body
 * @param idsArrays
 * @param t
 * @return {Array}
 */
const getPromisesForPeriods = (data, body, idsArrays, t) => {

    const promises = [];
    if(!_.isEmpty(body.eddSidePeriods)) {
        for(const period of body.eddSidePeriods) {
            /** If i receive an id which is present in the database, i update*/
            const possibleIndex = idsArrays.eddPeriods.indexOf(parseInt(period.id, 10));
            if(possibleIndex !== -1) {
                delete idsArrays.eddPeriods[possibleIndex];
                promises.push(EDDLiensPeriod.update({...period, party: "edd", eddLienId: data.id}, {where: {id: period.id}, transaction: t}));
                /** If i do not receive an id, i create*/
            } else {
                promises.push(EDDLiensPeriod.create({...period, party: "edd", eddLienId: data.id}, {transaction: t}));
            }
        }
    }
    if(!_.isEmpty(body.clientSidePeriods)) {
        for(const period of body.clientSidePeriods) {
            /** If i receive an id which is present in the database, i update*/
            const possibleIndex = idsArrays.clientPeriods.indexOf(parseInt(period.id, 10));
            if(possibleIndex !== -1) {
                delete idsArrays.clientPeriods[possibleIndex];
                promises.push(EDDLiensPeriod.update({...period, party: "client", eddLienId: data.id}, {where: {id: period.id}, transaction: t}));
                /** If i do not receive an id, i create*/
            } else {
                promises.push(EDDLiensPeriod.create({...period, party: "client", eddLienId: data.id}, {transaction: t}));
            }
        }
    }
    /** Delete the remaining eddPeriods, which are not in the body */
    for (const remainingId of idsArrays.eddPeriods) {
        promises.push(EDDLiensPeriod.destroy({where: {id: remainingId}}, {transaction: t}));
    }
    /** Delete the remaining clientPeriods, which are not in the body */
    for(const remainingId of idsArrays.clientPeriods) {
        promises.push(EDDLiensPeriod.destroy({where: {id: remainingId}}, {transaction: t}));
    }
    return promises;
};

/**
 * Creates a transaction in the db, in order to update EDDLien
 * Steps: update eddLien, update service, create or update periods
 *
 * @param db
 * @param model
 * @param body
 * @param caseId
 * @param idsArrays
 * @param res
 * @return {Promise<T>}
 */
const updateEddLien = (db, model, body, caseId, idsArrays, res) => {
    return db.transaction((t) => {
        return model.updateAttributes(body, {transaction: t})
            .then(async (data) => {
                await Service.update(body, {
                    where: {
                        eddLienId: data.id
                    }, transaction: t
                });
                return Promise.all(getPromisesForPeriods(data, body, idsArrays, t));
            });
    }).then(function () {
        // Transaction has been committed
        res.sendStatus(204);
    }).catch(function (err) {
        Raven.captureException(err);
        response(res).error(err, 500);
    });
};

export default ({ config, db, validate, validation }) => resource({

    mergeParams: true,

    /** Property name to store preloaded entity on `request`. */
    id : 'model',

    load,

    /** GET / - List all entities */
    index: [
        validate(validation.eddLiens.index),
        async (req, res) => {
            try {
                await Model.findAndCountAll({
                    distinct: true,
                    include: [
                        {
                            model: Service,
                            as: "service",
                            where: {
                                caseId: req.params.caseId
                            }
                        }
                    ],
                    where: {
                        caseId: req.params.caseId
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
        }
    ],

    /** POST / - Create a new entity */
    create (req, res) {
        response(res).error("You cannot store an EDDLien directly.", 422);
    },

    /** GET /:id - Return a given entity */
    read({ model }, res) {
        response(res).item(model);
    },

    /** PUT /:id - Update a given entity */
    update: [
        validate(validation.eddLiens.update),
        async ({model, body, params}, res) => {
            try {
                const idsArrays = {
                  eddPeriods: model.periods.filter(period => period.party === "edd").map(period => period.id),
                  clientPeriods: model.periods.filter(period => period.party === "client").map(period => period.id)
                };

                await updateEddLien(db, model, body, params.caseId, idsArrays, res);
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
