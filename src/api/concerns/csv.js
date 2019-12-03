import {filename, path} from './modifiers';
import response from "./response";
import Raven from "raven";
import fs from "fs";
import { resolve, resolveTitle } from "../../config/exportFields";

const json2csv = require('json2csv').parse;
const tempy = require('tempy');
const changeCase = require('change-case');

const generate = (data, exportableFields, entity, res) => {

    const opts = {
        fields: exportableFields.map(fieldName => (
          {
            label: changeCase.titleCase(resolveTitle(fieldName)),
            value: (row, field) => resolve(row, fieldName)
          }
        ))
    };
    try {
        const csv = json2csv(data, opts);
        const filePath = path(tempy.directory(), filename(entity, 'csv'));
        fs.writeFile(filePath, csv, (err) => {
            if(err) {
                Raven.captureException(err);
                response(res).error(err, 500);
            } else {
                res.download(filePath);
            }
        });
    } catch (err) {
        Raven.captureException(err);
        response(res).error(err, 500);
    }
};

module.exports = {
    generate
};
