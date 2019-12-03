import { alphanumeric, numeric, boolean } from './common';

const types = ['case', 'service', 'organization', 'venue', 'judge', 'contact'];

export default {
    index: {
        query: {
            entityType: alphanumeric().valid(types).required(),
            entityId: numeric().required()
        }
    },
    create: {
        body: {
            type: alphanumeric().required(),
            content: alphanumeric().required(),
            subject: alphanumeric().required(),
            activityType: alphanumeric().required(),
            contactMade: boolean(),
            contactMadeDate: alphanumeric(),
            entityType: alphanumeric().valid(types).required(),
            entityId: numeric().required()
        }
    },
    update: {
        body: {
            type: alphanumeric().required(),
            content: alphanumeric().required(),
            subject: alphanumeric().required(),
            activityType: alphanumeric().required(),
            contactMade: boolean(),
            contactMadeDate: alphanumeric()
        }
    }
}
