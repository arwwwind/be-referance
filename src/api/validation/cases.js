import Joi from 'joi';
import claim from './claim';
import { alphanumeric, numeric, boolean } from './common';

export default {
  index: {
    query: {
      quickView: alphanumeric().valid(["order_referral_date", "cases_with_edd_lien", "cases_with_lien"])
    }
  },
  create: {
    body: {
      name: alphanumeric().required(),
      referralDate: alphanumeric().required(),
      softDeleteRequested: boolean(),
      softDeleted: boolean(),
      cancelReason: alphanumeric(),
      status: alphanumeric(),
      caseSettlementAmount: alphanumeric(),
      noticeRepFiledServed: boolean(),
      injuredWorkerId: numeric().required(),
      caseOwnerId: numeric().required(),
      referralId: numeric().required(),

      actualVenueId: numeric(),
      accountId: numeric(),
      managingAdjusterId: numeric(),
      referredClaimOfficeId: numeric(),
      managingClaimOfficeId: numeric(),
      assignedVenueId: numeric(),
      claims: Joi.array().items(claim)
    }
  }
}
