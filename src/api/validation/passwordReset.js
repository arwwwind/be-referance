import Joi from 'joi';
import { alphanumeric } from './common';

export default {
  body: {
      email: alphanumeric().required(),
      password: alphanumeric().required(),
      passwordConfirmation: alphanumeric().required().valid(Joi.ref('password')).options({
          language: {
              any: {
                  allowOnly: 'Passwords do not match',
              }
          }
      })
  }
}
