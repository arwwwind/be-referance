import Joi from 'joi';
import { numeric } from './common';

export default {
  all: {
    params: {
      entity: Joi.string().valid(["contact", "case", "dashboard"]),
      entityId: numeric()
    }
  },
  overview: {
    params: {
      entity: Joi.string().valid(["contact", "venue", "judge", "organisation", "lien"]),
      entityId: numeric()
    }
  }
}
