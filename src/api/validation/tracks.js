import Joi from 'joi';
import { alphanumeric, numeric } from './common';

export default {
  create: {
    body: {
      name: alphanumeric().required(),
      preAssignedTo: numeric().required(),
      dueDate: alphanumeric().required(),
      summary: alphanumeric(),
      priority: alphanumeric(),
      taskType: alphanumeric(),
      description: alphanumeric(),
      serviceType: Joi.string().valid(['walkthrough', 'injuredWorkerOutreach', 'lienService', 'injuredWorkerInformation', 'eddLien', 'documentPreparation', 'misc']).required(),
      phase: Joi.string().valid(['review', 'progress', 'invoicing', 'hold', 'suspended']).required(),
      newPosition: numeric().min(0).required()
    }
  },
  update: {
    body: {
      name: alphanumeric().required(),
      preAssignedTo: numeric().required(),
      dueDate: alphanumeric().required(),
      summary: alphanumeric(),
      priority: alphanumeric(),
      taskType: alphanumeric(),
      description: alphanumeric()
    }
  },
  move: {
    body: {
      newPhase: Joi.string().valid(['review', 'progress', 'invoicing', 'hold', 'suspended']).required(),
      newPosition: numeric().min(0).required()
    },
    params: {
      entityId: numeric().min(0).required()
    }
  }
};
