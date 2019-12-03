import { alphanumeric, numeric, boolean } from './common';

export default {
  body: {
    wholePersonImparement: alphanumeric(),
    apportionment: alphanumeric(),
    futureMedical: alphanumeric(),
    TDPaid: numeric(),
    PDPercent: alphanumeric(),
    PDPaid: numeric(),
    LeavingBalance: alphanumeric(),
    PDValue: alphanumeric(),
    settlementDocs: boolean(),
    medicalReport: boolean(),
    QMEWaiver: boolean(),
    benefitPrintout: boolean(),
    benefitNotice: boolean(),
    TDBenefitPrintout: boolean(),
    PDBenefitPrintout: boolean(),
    medicalBenefitPrintout: boolean(),
    docWageStatement: alphanumeric(),
    docOfferOfWork: alphanumeric(),
    docRating: alphanumeric(),
    notesToHearingRep: alphanumeric(),
    CandRorStip: alphanumeric(),
    injuryDetails: alphanumeric(),
    doctorName: alphanumeric(),
    DWC1: boolean(),
    MSA: boolean(),
    MSAAmount: alphanumeric(),
    additionalDocuments: alphanumeric(),
    suspensionReason: alphanumeric(),
    insuredOrSelfInsured: alphanumeric(),
    referencedMedicalReportDoctorName: alphanumeric(),
    referencedMediacalReportDate: alphanumeric(),
    medicalBillsPaid: alphanumeric()
  }
}
