import { filename } from './modifiers';
import path from 'path';
import response from "./response";
import Raven from "raven";
import { resolve, resolveTitle } from "../../config/exportFields";

const pdf = require('html-pdf');
const ejs = require('ejs');
const tempy = require('tempy');

const changeCase = require('change-case');
const moment = require('moment');

const generate = (data, exportableFields, entity, res, opt) => {
  ejs.renderFile(path.resolve(__dirname, '../../templates/pdfs/dataTable.ejs'), {
    users: data,
    exportFields: exportableFields,
    changeCase,
    moment,
    resolve,
    resolveTitle
  }, function (err, result) {
    if (result) {
      const directory = tempy.directory();
      const options = {
        directory: directory,
        filename: directory + "/" + filename(entity["table"], 'pdf'),
        type: 'pdf',
        format: 'A1',
        orientation: opt.orientation,
        border: {
          top: 0,
          right: '15px',
          bottom: '0',
          left: '15px'
        },
        paginationOffset: 1,
        header: {
          height: '65px'
        },
        footer: {
          height: '40px'
        }
      };
      pdf.create(result, options).toFile(function (err, filePath) {
        if (err) {
          Raven.captureException(err);
          response(res).error(err, 500);
        } else {
          res.download(filePath.filename);
        }
      });
    } else {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  });
};

const generateForm = async (entity, promiseData, res, opt) => {
  const data = await promiseData;
  ejs.renderFile(path.resolve(__dirname, '../../templates/pdfs/forms/' + entity + '.ejs'), {
    data,
    changeCase,
    moment
  }, function (err, result) {
    if (result) {
      const directory = tempy.directory();
      const options = {
        directory: directory,
        filename: directory + "/" + filename(entity, 'pdf'),
        type: 'pdf',
        format: 'A4',
        orientation: opt.orientation,
        border: {
          top: 0,
          right: '15px',
          bottom: '0',
          left: '15px'
        },
        paginationOffset: 1,
        header: {
          height: '0px'
        },
        footer: {
          height: '0px'
        }
      };
      pdf.create(result, options).toFile(function (err, filePath) {
        if (err) {
          Raven.captureException(err);
          response(res).error(err, 500);
        } else {
          res.download(filePath.filename);
        }
      });
    } else {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  });
};

module.exports = {
  generate,
  generateForm
};
