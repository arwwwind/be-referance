import { alphanumeric, boolean } from './common';

export default {
    body: {
        meetingWithWorker: boolean(),
        lawyerInvolved: boolean(),
        interpretor: boolean(),
        signatureDateObtained: alphanumeric(),
        contactReason: alphanumeric(),
        result: boolean(),
        meetingLocation: alphanumeric(),
        typeOfWorkerMeeting: alphanumeric(),
        negotiatingSettlement: boolean(),
        authority: alphanumeric(),
        daysToObtainSignature: alphanumeric(),
        counterOffer: alphanumeric(),
        IWStillEmployed: boolean(),
        IWMedicareEligible: boolean(),
        SignatureStip: alphanumeric(),
        SignatureCANDR: alphanumeric(),
        noContact: alphanumeric(),
        QMERefusal: alphanumeric(),
        subType: alphanumeric(),
        SettlementAgreedTo: boolean()
    }
}
