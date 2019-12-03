import Joi from 'joi';
import { numeric } from './common';

export default {
  params: {
    entity: Joi.string().valid(["walkthrough"]).required(),
    entityId: numeric().min(0).required()
  }
}
