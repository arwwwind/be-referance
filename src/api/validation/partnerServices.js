import { alphanumeric, numeric } from './common';

export default {
  index: {
    query: {
      serviceId: numeric().required()
    }
  },
  create: {
    body: {
      partnerName: alphanumeric().required(),
      offerDate: alphanumeric().required(),
      medicalAmount: numeric().required(),
      signDate: alphanumeric(),
      declineReason: alphanumeric(),
      serviceDescription: alphanumeric(),
      serviceType: alphanumeric(),
      status: alphanumeric()
    }
  }
}
