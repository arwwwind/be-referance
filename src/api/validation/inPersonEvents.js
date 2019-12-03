import Joi from 'joi';
import { alphanumeric, numeric, boolean } from './common';

export default {
  calendar: {
    query: {
      serviceType: alphanumeric(),
      repConfirmed: boolean(),
      venueId: numeric(),
      search: alphanumeric()
    }
  },
  index: {
    query: {
      entity: Joi.string().valid(["case", "service"]).required(),
      entityId: numeric().required()
    }
  },
  create: {
    body: {
      dateOfHEaring: alphanumeric(),
      status: alphanumeric(),
      resourceConfirmed: boolean(),
      color: alphanumeric(),
      type: alphanumeric(),
      description: alphanumeric(),
      scheduledOrRandom: alphanumeric(),
      resourceId: numeric(),
      caseId: numeric(),
      venueId: numeric(),
      judgeId: numeric(),
      serviceId: numeric(),
      repId: numeric(),
      dateTime: alphanumeric(),
      rating: numeric(),
      ratingReason: alphanumeric()
    }
  }
}
