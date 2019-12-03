import Joi from 'joi';

export default {
  params: {
    type: Joi.string().valid(["adjuster", "manager", "injured-worker", "juvo-rep", "employee", "other"])
  },
  query: {
    sortId: Joi.string().valid(["name", "title", "contactType", "primary", "secondary", "fax", "email", "organization", "organizationTerritory", "linkedUser", "daysSinceLastReferral"]),
    sortOrder: Joi.string().valid(["ASC", "DESC"])
  }
}
