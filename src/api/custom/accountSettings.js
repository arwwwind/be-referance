import response from "../concerns/response";
import util from "../../lib/util";
import Raven from "raven";
import validate from 'express-validation';
import validation from '../validation/index';

const express = require('express');
const router  = express.Router();
const User = require('../../models/index').User;
const Profile = require('../../models/index').ContactProfile;

const findAndUpdateUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        });
        if(user !== null) {
            if(req.body["password"] && req.body["passwordConfirmation"]) {
                user.password  = await util.generateHashPassword(req.body["password"]);
            }
            user.loginEmail = req.body["loginEmail"];
            user.googleEmailLogin = req.body["googleEmailLogin"];
            user.save().then(async () => {
                const profile = await Profile.findOne({
                    where: {
                        id: req.user.profileId
                    }
                });
                profile.firstName = req.body["firstName"];
                profile.lastName = req.body["lastName"];
                profile.save().then(() => {
                    res.sendStatus(204);
                }).catch(err => {throw new Error(err);});
            }).catch(err => {
                Raven.captureException(err);
                return response(res).error(err, 500);
            });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        Raven.captureException(err);
        response(res).error(err, 500);
    }
};

router.put('/', validate(validation.accountSettings), async (req, res) => findAndUpdateUser(req, res));

export default router;
