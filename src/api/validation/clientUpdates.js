import { alphanumeric, numeric } from './common';

export default {
  index: {
    query: {
      serviceId: numeric().required()
    }
  },
  create: {
    body: {
      email: alphanumeric().required(),
      subject: alphanumeric().required(),
      activityType: alphanumeric().required(),
      body: alphanumeric().required(),
      updateDue: alphanumeric(),
      openUpdate: alphanumeric(),
      openedTime: alphanumeric()
    }
  }
}
