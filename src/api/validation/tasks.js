import Joi from 'joi';
import { alphanumeric, numeric } from './common';

export default {
  body: {
    name: alphanumeric().required(),
    dueDate: alphanumeric().required(),
    summary: alphanumeric(),
    taskType: alphanumeric(),
    description: alphanumeric(),
    workerId: numeric().required(),
    serviceId: numeric(),
    linkedCases: Joi.array().items(numeric())
  }
}
