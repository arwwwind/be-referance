import Joi from "joi";
import { numeric } from './common';

export default Joi.object().keys({
  claimNumber: numeric()
})
