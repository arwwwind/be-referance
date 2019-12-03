const moment = require('moment');
const fs = require('fs');
const path = require('path');

/**
 * Removes the password from the user object
 *
 * @param user
 * @return {*}
 */
const tokenBodyFor = (user) => {
  const body = user.get({
    plain: true
  });

  delete body.password;

  return body;
};

/**
 * Splits a name string into firstName and lastName
 *
 * @param name
 * @return {{firstName, lastName: *}}
 */
const parseName = (name) => {
  const [ firstName, ...rest ] = name ? name.split(' ') : ['', []];
  const lastName = rest.join(' ');

  return { firstName, lastName };
};

/**
 * Prepares the options for the paginator (used in displaying a listing of the resource)
 *
 * @param req
 * @param data
 * @return {{results: *, pageCount: number, itemCount: *, req: *}}
 */
const getPaginatorOptions = (req, data) => {
  const itemCount = data.rows.length;
  const pageCount = Math.ceil(data.count / req.query.limit);
  return {
    data, pageCount, itemCount, req
  };
};

/**
 * Creates entity filename, given entity name and extension
 *
 * @param entity
 * @param extension
 * @return {string}
 */
const filename = (entity, extension) => entity + '_' + moment().valueOf() + '.' + extension;

/**
 * Joins directory with filename
 *
 * @param dirname
 * @param filename
 * @return {string}
 */
const pathName = (dirname, filename) => dirname + "/" + filename;

/**
 * Moves the file specified in the path, to dir2
 *
 * @param file
 * @param dir2
 */
const moveFile = (file, dir2)=>{
  const f = path.basename(file);
  const dest = path.resolve(dir2, f);

  fs.rename(file, dest, (err)=>{
    if(err) throw err;
  });
};

/**
 * Formats phone number
 *
 * @param type
 * @param number
 * @param extension
 * @return {*}
 */
const formatPhone = (type, number, extension) => {
  if (!type && !number && !extension) {
    return null;
  }

  return `${type ? `(${type})` : ''} ${number || ''} ${(extension && (number || type)) ? ' - ' : ''} ${extension || ''}`;
};

module.exports = {
  tokenBodyFor,
  parseName,
  getPaginatorOptions,
  filename,
  path: pathName,
  moveFile,
  formatPhone
};