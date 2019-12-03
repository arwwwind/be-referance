import Joi from 'joi';
import { alphanumeric } from './common';

export default {
  body: {
      firstName: alphanumeric().required(),
      lastName: alphanumeric().required(),
      loginEmail: alphanumeric().required(),
      password: alphanumeric(),
      passwordConfirmation: Joi.string().valid(Joi.ref('password')).options({
          language: {
              any: {
                  allowOnly: 'Passwords do not match',
              }
          }
      })
  }
}
