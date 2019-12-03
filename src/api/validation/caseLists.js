import Joi from 'joi';
import { numeric } from './common';

export default {
  params: {
    entity: Joi.string().valid(["contact", "judge", "venue", "dashboard", "organisation"]),
    entityId: numeric()
  }
}
