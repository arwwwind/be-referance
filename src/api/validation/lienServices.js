import { alphanumeric } from './common';

export default {
    body: {
        designationDate: alphanumeric(),
        employer: alphanumeric(),
        dateOfDelay: alphanumeric(),
        dateOfDenial: alphanumeric(),
        dateOfMPNNotice: alphanumeric(),
        acceptanceDate: alphanumeric(),
        terminationDate: alphanumeric(),
        denialReason: alphanumeric(),
        primaryTreatingPhysician: alphanumeric(),
        basisOfSettlement: alphanumeric(),
        QMEorAME: alphanumeric(),
        applicantDepositionDate: alphanumeric()
    }
}
