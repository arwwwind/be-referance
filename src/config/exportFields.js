import { getAllServices as getAllServicesForContact, getOneTimeSuspendedServices } from "../api/custom/metrics/contact";
import { getAllServices as getAllServicesForVenue } from "../api/custom/metrics/venueOverview";
import { getAllCases as getAllCasesForJudge, getAllServices as getAllServicesForJudge } from "../api/custom/metrics/judgeOverview";
import uniqBy from 'lodash/uniqBy';

const moment = require("moment");
const WALKTHROUGH = 'walkthrough';
const DOCUMENT_PREPARATION = 'documentPreparation';
const IWIM = 'injuredWorkerInformation';
const LIEN = 'lienService';
const EDD_LIEN = 'eddLien';
const IWO = 'injuredWorkerOutreach';
const MISC = 'misc';
const list = [
  {
    value: WALKTHROUGH,
    label: 'Walkthrough'
  },
  {
    value: DOCUMENT_PREPARATION,
    label: 'Document Preparation'
  },
  {
    value: IWIM,
    label: 'IWIM'
  },
  {
    value: LIEN,
    label: 'Lien Service'
  },
  {
    value: EDD_LIEN,
    label: 'EDD Lien'
  },
  {
    value: IWO,
    label: 'IWO'
  },
  {
    value: MISC,
    label: 'Misc'
  }
];

const getLabelByValue = (value) => {
  const filtered = list.filter((item) => item.value === value);
  return filtered.length ? filtered[0].label : null;
};

const getServicesTypes = (services) => {
  const servicesTypesList = uniqBy(services, 'serviceType').map((service) => service.serviceType);
  return servicesTypesList.map((service) => getLabelByValue(service)).join(', ');
};

export default {
  "Users": [
    "id",
    "profile.firstName",
    "profile.lastName",
    "loginEmail",
    "googleEmailLogin",
    "active",
    "lastLogin",
    "manager",
    "profile.title",
    "profile.specialInstructionNotes",
    "profile.verifiedContact",
    "profile.salesContactNotes",
    "profile.dateOfBirth",
    "profile.address",
    "profile.faxNumber",
    "profile.faxLink",
    "profile.officeNumber",
    "profile.primaryPhoneNumberType",
    "profile.primaryPhoneNumber",
    "profile.primaryPhoneNumberExtension",
    "profile.secondaryPhoneNumberType",
    "profile.secondaryPhoneNumber",
    "profile.secondaryPhoneNumberExtension",
    "profile.officeNumberType",
    "profile.officeNumberExtension",
    "profile.description"
  ],
  "Judges": [
    "id",
    "firstName",
    "lastName",
    "active",
    "notes",
    async (judge) => {
      const services = await getAllServicesForJudge(judge.id);

      const walkthroughs = services
        .filter(service => !!service.walkthrough);
      const oneTimeSuspendedWalkthroughs = getOneTimeSuspendedServices(walkthroughs);

      return {
        "label": "Approval Rating",
        "value": walkthroughs.length ? ((walkthroughs.length - oneTimeSuspendedWalkthroughs.length) / walkthroughs.length) * 100 : ''
      }
    },
    async (judge) => {
      const services = await getAllServicesForJudge(judge.id);
      const cases = getAllCasesForJudge(services);

      return {
        "label": "Number of cases",
        "value": cases.length
      }
    }
  ],
  "ContactProfiles": [
    "id",
    "firstName",
    "lastName",
    "title",
    "email",
    "inactive",
    "verifiedContact",
    "specialInstructionNotes",
    "salesContactNotes",
    "dateOfBirth",
    "address",
    "verifiedContact",
    "faxNumber",
    "faxLink",
    "officeNumber",
    "primaryPhoneNumberType",
    "primaryPhoneNumber",
    "primaryPhoneNumberExtension",
    "secondaryPhoneNumberType",
    "secondaryPhoneNumber",
    "secondaryPhoneNumberExtension",
    "officeNumberType",
    "officeNumberExtension",
    "description",
    "user.loginEmail",
    "user.googleEmailLogin",
    "user.active",
    async (contact) => {
      const services = await getAllServicesForContact(contact.id);

      return {
        "label": "Days since last referral",
        "value": services[0] ? moment().diff(moment(services[0].createdAt), 'days') : ''
      }
    }
  ],
  "Venues": [
    "id",
    "name",
    "abbreviation",
    "address",
    "color",
    "boardNotes",
    "walkThroughSchedule",
    "sameDayAdj",
    "canWeSelectJudge",
    "approvalRating",
    async (venue) => {
      const services = await getAllServicesForVenue(venue.id);

      const walkthroughs = services
        .filter(service => !!service.walkthrough);
      const oneTimeSuspendedWalkthroughs = getOneTimeSuspendedServices(walkthroughs);

      return {
        "label": "Approval Rating",
        "value": walkthroughs.length ? ((walkthroughs.length - oneTimeSuspendedWalkthroughs.length) / walkthroughs.length) * 100 : ''
      }
    }
  ],
  "Organisations": [
    "id",
    "companyName",
    "address",
    "mainPhone",
    "fax",
    "website",
    "specialInstructionNotes",
    "accountVerified",
    "leinClaimentStayed",
    "territory",
    "servicesProvided",
    "physicianOrNonPhysician"
  ],
  "Cases": [
    "id",
    "name",
    "status",
    "description",
    "referralDate",
    "cancelReason",
    "account",
    (caseData) => ({
      "label": "Referred By",
      "value": caseData.referral ? `${caseData.referral.firstName} ${caseData.referral.lastName}` : ''
    }),
    (caseData) => ({
      "label": "Case Owner",
      "value": caseData.caseOwner ? `${caseData.caseOwner.firstName} ${caseData.caseOwner.lastName}` : ''
    }),
    (caseData) => ({
      "label": "Service Type",
      "value": getServicesTypes(caseData.services)
    })
  ]
}

export const resolve = (obj, path) => {
  path = path.split('.');
  var current = obj;
  while(path.length) {
    if(typeof current !== 'object') return undefined;
    if(current === null) return undefined;
    current = current[path.shift()];
  }
  return current;
};

export const resolveTitle = (field) => {
  const parts = field.split('.');
  return parts[parts.length - 1];
};
