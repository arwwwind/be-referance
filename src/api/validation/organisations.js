import Joi from 'joi';
import { alphanumeric } from './common';

export default {
  body: {
    companyName: alphanumeric().required(),
    type: alphanumeric().required(),
    address: alphanumeric(),
    accounts: Joi.array()
  }
}
