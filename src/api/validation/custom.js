import Joi from 'joi';
import { alphanumeric, numeric } from './common';

export default {
  inCompleteTasks: {
  },
  completeTasks: {
  },
  myTasks: {
    query: {
      filter: Joi.string().valid(['overdue', 'today', 'next-7-days'])
    }
  },
  caseTasks: {
    query: {
      serviceType: Joi.string().valid(['lienService', 'iwo', 'walkthrough', 'eddLien', 'iwm', 'documentPreparation', 'misc']),
      caseId: numeric().required()
    }
  },
  serviceTasks: {
    query: {
      serviceId: numeric().required()
    }
  },
  pixel: {
    query: {
      cuId: numeric().min(1).required()
    }
  },
  userStatus: {
    params: {
      id: numeric().min(1).required()
    },
    body: {
      active: alphanumeric().required()
    }
  }
}
