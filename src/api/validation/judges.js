import { alphanumeric, numeric } from './common';

export default {
  body: {
    name: alphanumeric().required(),
    venueId: numeric().required()
  }
}
