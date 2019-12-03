import {formatPhone} from "../concerns/modifiers";

const Service = require('../../models/index').Service;
const Case = require('../../models/index').Case;
const ContactProfile = require('../../models/index').ContactProfile;
const EDDLien = require('../../models/index').EDDLien;
const Walkthrough = require('../../models/index').Walkthrough;
const Organisation = require('../../models/index').Organisation;

const getServiceModel = async (serviceId) => {
  return await Service.findById(serviceId, {
    include: [
      {
        model: Case,
        as: 'case',
        include: [
          {
            model: ContactProfile,
            as: 'injuredWorker'
          },
          {
            model: Organisation,
            as: 'account'
          }
        ]
      },
      {
        model: EDDLien,
        as: 'eddLien'
      },
      {
        model: Walkthrough,
        as: 'walkthrough'
      },
      {
        model: ContactProfile,
        as: 'currentClaimHandler'
      }
    ]
  });
};

const formWalkthroughObject = async (entityId) => {
  const service = await getServiceModel(entityId);
  if(service) {
    return {
      injuredWorkerInformation: {
        name: (service.case && service.case.injuredWorker) ? `${service.case.injuredWorker.firstName} ${service.case.injuredWorker.lastName}` : '-',
        phone: (service.case && service.case.injuredWorker) ? `${formatPhone(service.case.injuredWorker.primaryPhoneNumberType, service.case.injuredWorker.primaryPhoneNumber, service.case.injuredWorker.primaryPhoneNumberExtension) || '-'}` : '-',
        represented: !!service.currentClaimHandler,
        representedByName: service.currentClaimHandler ? `${service.currentClaimHandler.firstName} ${service.currentClaimHandler.lastName}` : '-',
        representedByPhone: service.currentClaimHandler ? `${formatPhone(service.currentClaimHandler.primaryPhoneNumberType, service.currentClaimHandler.primaryPhoneNumber, service.currentClaimHandler.primaryPhoneNumberExtension) || '-'}` : '-'
      },
      caseDetails: {
        settlementType: service.settlementType || '-',
        adj: service.ADJNumber || '-',
        doi: service.walkthrough && service.walkthrough.additionalDOIS || '-',
        eddLien: !!service.eddLien,
        tdPaid: service.walkthrough && service.walkthrough.TDPaid ? service.walkthrough.TDPaid : '-',
        pdPercent: service.walkthrough && service.walkthrough.PDPercent || '-',
        pdValue: service.walkthrough && service.walkthrough.PDValue || '-',
        pdPaid: service.walkthrough && service.walkthrough.PDPaid || '-',
        leavingBalance: service.walkthrough && service.walkthrough.leavingBalance || '-',
        medicalBillsPaid: service.walkthrough && service.walkthrough.medicalBillsPaid || '-',
        MSAAmount: service.walkthrough && service.walkthrough.MSAAmount || '-'
      },
      medicalInformation: {
        injuryDetails: service.walkthrough && service.walkthrough.injuryDetails || '-',
        wpi: service.walkthrough && service.walkthrough.wholePersonImparement || '-',
        apportionment: service.walkthrough && service.walkthrough.apportionment || '-',
        futureMedical: service.walkthrough && service.walkthrough.futureMedical || '-'
      },
      checklist: {
        settlementDocs: service.walkthrough && !!service.walkthrough.settlementDocs,
        medicalReport: service.walkthrough && !!service.walkthrough.medicalReport,
        benefitNotice: service.walkthrough && !!service.walkthrough.benefitNotice,
        PDBenefitPrintout: service.walkthrough && !!service.walkthrough.PDBenefitPrintout,
        medicalBenefitPrintout: service.walkthrough && !!service.walkthrough.medicalBenefitPrintout,
        MSA: service.walkthrough && !!service.walkthrough.MSA,
        QMEWaiver: service.walkthrough && !!service.walkthrough.QMEWaiver,
        benefitPrintout: service.walkthrough && !!service.walkthrough.benefitPrintout,
        TDBenefitPrintout: service.walkthrough && !!service.walkthrough.TDBenefitPrintout,
        docOfferOfWork: service.walkthrough && !!service.walkthrough.docOfferOfWork,
        DWC1: service.walkthrough && !!service.walkthrough.DWC1,
        notesToHearingRep: service.walkthrough && service.walkthrough.notesToHearingRep || '-'
      },
      referralDate: service.case && service.case.referralDate || '-'
    }
  }
  return {};
};

const getDataFor = async (entity, entityId) => {
  if(entity ===  "walkthrough") {
    return await formWalkthroughObject(entityId);
  }
  return {};
};

module.exports = {
  getDataFor
};
