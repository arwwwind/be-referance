import Joi from 'joi';
import { numeric } from './common';

export default {
  services: {
    list: {
      params: {
        serviceId: numeric().min(0).required()
      }
    },
    listActions: {
      params: {
        serviceId: numeric().min(0).required(),
        action: Joi.string().valid(["hold", "suspend", "cancel"]).required()
      }
    },
    reason: {
      params: {
        serviceId: numeric().min(0).required()
      },
      body: {
        reason: Joi.string().required()
      }
    },
    delete: {
      params: {
        serviceId: numeric().min(0).required()
      }
    }
  },
  cases: {
    delete: {
      params: {
        caseId: numeric().min(0).required()
      }
    }
  }
}
