import {filename, path} from './modifiers';
import response from "./response";
import Raven from "raven";
const Excel = require('excel4node');
const tempy = require('tempy');
const changeCase = require('change-case');
import { resolve, resolveTitle } from "../../config/exportFields";

const getExcelData = (dbCollection, exportableFields) => {
  const excelData = [];
  const header = [];
  for(const field of exportableFields) {
    header.push(changeCase.titleCase(resolveTitle(field)));
  }
  excelData.push(header);

  for(const object of dbCollection) {

    const row = [];
    for(const field of exportableFields) {
      const value = resolve(object, field);
      row.push(
        value ? value : ''
      );
    }
    excelData.push(row);
  }
  return excelData;
};

const getSimpleExcelData = (dbCollection, columns) => {
  const excelData = [];
  const header = [];
  for(const column of columns) {
    header.push(column);
  }
  excelData.push(header);

  for(const object of dbCollection) {

    const row = [];
    for(const property in object) {
      row.push(
        object[property] ? object[property] : '',
      );
    }
    excelData.push(row);
  }
  return excelData;
};

const generate = (data, entity, res) => {
  const wb = new Excel.Workbook();
  const ws = wb.addWorksheet(entity);

  for(let i = 1; i <= data.length; i++) {
    for(let j = 1; j <= data[i - 1].length; j++) {
      ws.cell(i, j).string('' + data[i - 1][j - 1]);
    }
  }

  const filePath = path(tempy.directory(), filename(entity, 'xls'));
  wb.write(filePath, function(err, stats) {
    if(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    } else {
      res.download(filePath);
    }
  });
};

/**
 * Generates a xls file with multiple sheets
 *
 * @param res
 * @param docName
 * @param sheetNames
 * @param dataCollections
 */
const generateMultipleSheets = (res, docName, sheetNames, ...dataCollections) => {
  const wb = new Excel.Workbook();
  for(let i = 0; i < dataCollections.length; ++i) {
    const ws = wb.addWorksheet(sheetNames[i], {});
    //Height -> gets items, 1 by 1
    for(let j = 1; j <= dataCollections[i].length; j++) {
      //Width -> gets properties of item, 1 by 1
      for(let k = 1; k <= dataCollections[i][j - 1].length; k++) {
        if(typeof dataCollections[i][j - 1][k - 1] === "object") {
          ws.cell(j, k).formula(dataCollections[i][j - 1][k - 1].replaceable.replace(/:i/g, j));
        } else {
          ws.cell(j, k).string('' + dataCollections[i][j - 1][k - 1]);
        }
      }
    }
  }

  const filePath = path(tempy.directory(), filename(docName, 'xls'));
  wb.write(filePath, function(err, stats) {
    if(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    } else {
      // response(res).item(filePath);
      res.download(filePath);
    }
  });
};

module.exports = {
  generate,
  generateMultipleSheets,
  getExcelData,
  getSimpleExcelData
};
