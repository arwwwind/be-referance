import Joi from 'joi';

export default {
  params: {
    type: Joi.string().valid(["account", "lien-claiment", "claim-office"])
  }
}