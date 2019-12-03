import { alphanumeric, boolean } from './common';

export default {
    body: {
        WCABFilingIncluded: boolean(),
        draftRequest: alphanumeric(),
        EfileInPerson: alphanumeric(),
        confirmationNumber: boolean()
    }
}
