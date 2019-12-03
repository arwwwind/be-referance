import Joi from 'joi';
import { alphanumeric, boolean } from './common';

const eddPeriod = Joi.object().keys({
    startDate: alphanumeric(),
    endDate: alphanumeric(),
    weeklyRate: alphanumeric()
});
const clientPeriod = Joi.object().keys({
    paymentType: Joi.string().valid(["PD", "TD"]),
    startDate: alphanumeric(),
    endDate: alphanumeric(),
    weeklyRate: alphanumeric()
});

export default {
    index: {
        query: {}
    },
    create: {
        body: {
            disputedPeriod: alphanumeric(),
            paymentRate: alphanumeric(),
            bodyPartCertified: boolean(),
            physicianCertified: boolean(),
            dateOfNoticeToCarrier: alphanumeric(),
            EDDLienAuthority: alphanumeric(),
            EDDLienType: alphanumeric(),
            agreeOrDisagree: boolean(),
            disagreeReason: alphanumeric(),
            EDDLienOffice: alphanumeric()
        }
    },
    update: {
        //Service
        demand: alphanumeric(),
        caseSettlementDate: alphanumeric(),
        permantAndStationeryDate: alphanumeric(),
        settlementAuthority: alphanumeric(),

        //EDDLien
        dateOfNoticeToCarrier: alphanumeric(),
        agreeOrDisagree: boolean(),
        disagreeReason: alphanumeric(),
        eddRepId: Joi.number(),
        EDDLienType: alphanumeric(),
        certifiedDoctor: alphanumeric(),
        certifiedBodyParts: alphanumeric(),
        doctor: alphanumeric(),
        bodyParts: alphanumeric(),

        eddSidePeriods: Joi.array().items(eddPeriod),
        clientSidePeriods: Joi.array().items(clientPeriod),
    }
}
