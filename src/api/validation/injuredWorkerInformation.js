import { boolean } from './common';

export default {
    body: {
        medicalReleaseObtained: boolean(),
        juvoChecklistSigned: boolean(),
        IWhasPacket: boolean()
    }
}
