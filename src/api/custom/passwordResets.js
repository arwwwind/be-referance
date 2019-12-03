import response from "../concerns/response";
import crypto from 'crypto';
import util from "../../lib/util";
import {Op} from "sequelize";
import jwt from "jsonwebtoken";
import {tokenBodyFor} from '../concerns/modifiers';
import mail from "../concerns/mail";
import Raven from "raven";
import config from '../../config.json';
import validate from 'express-validation';
import validation from '../validation/index';

const express = require('express');
const router  = express.Router();
const User = require('../../models/index').User;
const PasswordResets = require('../../models/index').PasswordResets;
const ContactProfile = require('../../models/index').ContactProfile;
const moment = require("moment");

async function findUserReplacePassword(req, res, tokenRecord) {
    try {
        const hash = await util.generateHashPassword(req.body["password"]);
        const user = await User.findOne({
            where: {
                id: tokenRecord.userId,
                loginEmail: req.body["email"]
            },
            include: [
                {
                    model: ContactProfile,
                    as: 'profile'
                }
            ],
        });
        if(user !== null) {
            const token = jwt.sign(tokenBodyFor(user), config.secretKey);
            user.password = hash;
            user.lastPasswordReset = moment().format(config.dateWithTimezone);
            user.save().then(() => {
                response(res).item({user, token});
            }).catch(err => {
                Raven.captureException(err);
                return response(res).error('Internal server error', 500);
            });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        Raven.captureException(err);
        response(res).error(err, 500);
    }
}

router.post('/', async (req, res) => {
    const user = await User.findOne({
        where: {
            loginEmail: req.body.email,
            active: true
        }
    });
    if(user !== null) {
        const token = crypto.randomBytes(30).toString('hex');
        await PasswordResets.create({
            userId: user.id,
            token: token,
            expiresAt: moment().add(1, 'hour').format(config.dateWithTimezone)
        });
        try {
            await mail.sendPasswordReset(req.body.email, token);
            res.sendStatus(200);
        } catch (err) {
            Raven.captureException(err);
            response(res).error(err, 500);
        }
    } else {
        res.sendStatus(200);
    }
});

router.post('/:token', validate(validation.passwordReset), async (req, res) => {
    const tokenRecord = await PasswordResets.findOne({
        where: {
            token: req.params["token"],
            expiresAt: {
                [Op.gt]: moment().format(config.dateWithTimezone)
            }
        }
    });
    if(tokenRecord !== null) {
        return findUserReplacePassword(req, res, tokenRecord);
    } else {
        res.sendStatus(404);
    }
});

export default router;
