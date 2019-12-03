import response from "../concerns/response";
import multer from 'multer';
import validation from "../validation";
import validate from "express-validation";
import Raven from "raven";
import {Router} from "express";
import fs from "fs";

const ContactProfile = require('../../models/index').ContactProfile;
const FileAttachment = require('../../models/index').FileAttachment;
const moment = require('moment');
const models = {
  note: require('../../models/index').Notes
};

export default (db) => {
  let router  = new Router();

  /**
   * configuring Multer to use files directory for storing files
   * @type {*|DiskStorage}
   */
  const storage = multer.diskStorage({
    destination: appRoot + '/upload',
    filename(req, file, cb) {
      cb(null, `${req.user.id}_${moment().valueOf()}_${file.originalname}`);
    },
  });
  const uploader = multer({storage});

  /** Uploads the logged in user's avatar */
  router.post('/upload/avatar', validate(validation.upload.profile), uploader.single('file'), async (req, res) => {
    try {
      const profile = await ContactProfile.findById(req.user.id);
      if(profile.userImage && fs.existsSync(profile.userImage)) {
        fs.unlink(profile.userImage, (err) => {
          if (err) throw err;
        })
      }
      await ContactProfile.update({userImage: req.file.path, hasImage: true}, {where: {id: req.user.profileId}});
      res.sendStatus(204);
    } catch(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  });

  /** Gets the logged in user's avatar */
  router.get('/avatar', async (req, res) => {
    try {
      const profile = await ContactProfile.findById(req.user.profileId);
      if(profile.userImage && fs.existsSync(profile.userImage)) {
        res.sendFile(profile.userImage);
      } else {
        res.sendStatus(404);
      }
    } catch(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  });

  /** Deletes the logged in user's avatar */
  router.delete('/avatar', async (req, res) => {
    try {
      const profile = await ContactProfile.findById(req.user.profileId);
      if(profile.userImage && fs.existsSync(profile.userImage)) {
        await ContactProfile.update({userImage: null, hasImage: false}, {where: {id: req.user.profileId}});
        fs.unlink(profile.userImage, (err) => {
          if(err) throw err;
          res.sendStatus(204);
        });
      } else {
        res.sendStatus(404);
      }
    } catch(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  });

  /** Uploads a contact's avatar */
  router.post('/upload/avatar/:contactId', validate(validation.upload.profile), uploader.single('file'), async (req, res) => {
    try {
      const profile = await ContactProfile.findById(req.params.contactId);
      if(profile.userImage && fs.existsSync(profile.userImage)) {
        fs.unlink(profile.userImage, (err) => {
          if (err) throw err;
        })
      }
      await ContactProfile.update({userImage: req.file.path, hasImage: true}, {where: {id: req.params.contactId}});
      res.sendStatus(204);
    } catch(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  });

  /** Gets the contact's avatar */
  router.get('/avatar/:contactId', async (req, res) => {
    try {
      const profile = await ContactProfile.findById(req.params.contactId);
      if(profile.userImage && fs.existsSync(profile.userImage)) {
        res.sendFile(profile.userImage);
      } else {
        res.sendStatus(404);
      }
    } catch(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  });

  /** Deletes the contact's avatar */
  router.delete('/avatar/:contactId', async (req, res) => {
    try {
      const profile = await ContactProfile.findById(req.params.contactId);
      if(profile.userImage && fs.existsSync(profile.userImage)) {
        await ContactProfile.update({userImage: null, hasImage: false}, {where: {id: req.params.contactId}});
        fs.unlink(profile.userImage, (err) => {
          if(err) throw err;
          res.sendStatus(204);
        });
      } else {
        res.sendStatus(404);
      }
    } catch(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  });

  /** Uploads a file for a given entity */
  router.post('/upload/:entity/:entityId', validate(validation.upload.uploadFile), uploader.single('file'), async (req, res) => {
    try {
      const entity = await models[req.params.entity].findById(req.params.entityId);
      const file = await FileAttachment.create({
        fileName: req.file.originalname,
        filePath: req.file.path,
        tag: req.body.tag,
        description: req.body.description,
        googleDriveFileId: req.body.googleDriveFileId
      });
      if(entity && file) {
        await entity.addFile(file.id);
        res.sendStatus(204);
      } else {
        if(fs.existsSync(req.file.path)) {
          fs.unlink(req.file.path, (err) => {
            if(err) throw err;
          });
        }
        response(res).error("Internal server error", 500);
      }
    } catch(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  });

  /** Gets an uploaded file */
  router.get('/:id', async (req, res) => {
    try {
      const fileAttachment = await FileAttachment.findById(req.params.id);
      if(fileAttachment && fileAttachment.filePath && fs.existsSync(fileAttachment.filePath)) {
        res.sendFile(fileAttachment.filePath);
      } else {
        res.sendStatus(404);
      }
    } catch(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  });

  /** Deletes an uploaded file */
  router.delete('/:id', async (req, res) => {
    try {
      const fileAttachment = await FileAttachment.findById(req.params.id);
      if(fileAttachment && fileAttachment.filePath && fs.existsSync(fileAttachment.filePath)) {
        FileAttachment.destroy({where: {id: req.params.id}});
        fs.unlink(fileAttachment.filePath, (err) => {
          if(err) throw err;
          res.sendStatus(204);
        });
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