import { alphanumeric, numeric } from './common';

export default {
  body: {
    startDate: alphanumeric().required(),
    endDate: alphanumeric().required(),
    organisationId: numeric().required()
  }
}
