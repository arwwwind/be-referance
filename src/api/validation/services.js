import Joi from 'joi';
import lienServices from './lienServices';
import injuredWorkerOutreach from './injuredWorkerOutreach';
import injuredWorkerInformation from './injuredWorkerInformation';
import walkthroughs from './walkthroughs';
import miscs from './miscs';
import eddLiens from './eddLiens';
import documentPreparation from './documentPreparation';
import serviceTags from './serviceTags';
import claim from "./claim";
import { alphanumeric, numeric } from './common';

export default {
  body: {
    serviceStartDate: alphanumeric(),
    serviceEnd: alphanumeric(),
    description: alphanumeric(),
    settlementAuthority: alphanumeric(),
    cancelReason: alphanumeric(),
    status: Joi.any().valid(['active', 'cancelled']),
    permantAndStationeryDate: alphanumeric(),
    billingAmount: numeric(),
    invoiceID: alphanumeric(),
    serviceType: Joi.any().valid(['lienService', 'injuredWorkerOutreach', 'walkthrough', 'eddLien', 'injuredWorkerInformation', 'documentPreparation', 'misc']).required(),
    settlementType: alphanumeric(),
    caseSettlementDate: alphanumeric(),

    lienServiceInformation: Joi.object().keys(lienServices.body),
    iwoInformation: Joi.object().keys(injuredWorkerOutreach.body),
    walkthroughInformation: Joi.object().keys(walkthroughs.body),
    eddLienInformation: Joi.object().keys(eddLiens.create.body),
    iwmInformation: Joi.object().keys(injuredWorkerInformation.body),
    documentPreparationInformation: Joi.object().keys(documentPreparation.body),
    miscInformation: Joi.object().keys(miscs.body),

    eddLienClaimNumber: alphanumeric(),
    eddLienInjuryEndDate: alphanumeric(),
    eddLienInjuryStartDate: alphanumeric(),

    tags: Joi.array().items(Joi.object().keys(serviceTags.body)),
    claims: Joi.array().items(claim)
  }
}
