import Joi from 'joi';
import { numeric } from './common';

export default {
  params: {
    entity: Joi.string().valid(["venue"]),
    entityId: numeric()
  }
}
