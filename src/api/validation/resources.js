import { alphanumeric, numeric } from './common';

export default {
  body: {
    internalName: alphanumeric().required(),
    description: alphanumeric().required(),
    venueId: numeric().required(),
    workerId: numeric().required(),
    organisationId: numeric().required()
  }
}
