import { alphanumeric, numeric } from './common';

export default {
  profile: {
    file: {
      file: alphanumeric().required()
    }
  },
  uploadFile: {
    params: {
      entity: alphanumeric().valid(["note"]).required(),
      entityId: numeric().required()
    },
    file: {
      file: alphanumeric().required()
    }
  }
}
