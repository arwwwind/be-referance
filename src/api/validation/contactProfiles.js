import Joi from 'joi';
import { alphanumeric, numeric } from './common';

export default {
  index: {
    query: {
      sortId: alphanumeric().valid(["name", "title", "contactType", "primary", "secondary", "fax", "email", "organization", "organizationTerritory", "linkedUser", "daysSinceLastReferral"]),
      sortOrder: alphanumeric().valid(["ASC", "DESC"])
    }
  },
  create: {
    body: {
      firstName: alphanumeric().required(),
      lastName: alphanumeric().required(),
      remoteOrLocal: alphanumeric().valid(["remote", "local"]),
      primaryBoards: Joi.array().items(numeric()),
      accounts: Joi.array().items(numeric())
    }
  },
}
