import { alphanumeric, numeric, boolean } from './common';

export default {
  index: {
    query: {
      serviceId: numeric().required()
    }
  },
  create: {
    body: {
      serviceId: numeric().required(),
      claimentNameId: numeric().allow(null),
      representedById: numeric().allow(null),
      settledBeforeLitigation: alphanumeric().allow(null),
      resolvedDate: alphanumeric().allow(null),
      settlementSummary: alphanumeric().allow(null),
      description: alphanumeric().allow(null),
      flagged: boolean().allow(null),
      flagReason: alphanumeric().allow(null),
      dateOfServiceStart: alphanumeric().allow(null),
      dateOfServiceEnd: alphanumeric().allow(null),
      fillingDate: alphanumeric().allow(null),
      authority: alphanumeric().allow(null),
      paid: alphanumeric().allow(null),
      balance: alphanumeric().allow(null),
      startDate: alphanumeric().allow(null),
      endDate: alphanumeric().allow(null),
      defenses: alphanumeric().allow(null),
      inCourtOutOfCourt: boolean().allow(null),
      deferred: alphanumeric().allow(null),
      resolvedByOther: alphanumeric().allow(null),
      demand: alphanumeric().allow(null),
      requestedStatus: alphanumeric().allow(null)
    }
  }
}
