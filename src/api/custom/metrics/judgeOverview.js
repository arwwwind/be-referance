import {getOneTimeSuspendedServices} from "./contact";
import {Op} from "sequelize";

const ContactProfile = require('../../../models/index').ContactProfile;
const Case = require('../../../models/index').Case;
const Venue = require('../../../models/index').Venue;
const Service = require('../../../models/index').Service;
const Claim = require('../../../models/index').Claim;
const DocumentPreparation = require('../../../models/index').DocumentPreparation;
const EDDLien = require('../../../models/index').EDDLien;
const InjuredWorkerInformation = require('../../../models/index').InjuredWorkerInformation;
const InjuredWorkerOutreach = require('../../../models/index').InjuredWorkerOutreach;
const LienService = require('../../../models/index').LienService;
const Walkthrough = require('../../../models/index').Walkthrough;
const Misc = require('../../../models/index').Misc;
const Judge = require('../../../models/index').Judge;
const ServiceTag = require('../../../models/index').ServiceTag;
const ServiceActions = require('../../../models/index').ServiceActions;
const Lien = require('../../../models/index').Lien;

export const getAllServices = (id) => {
  return Service.findAll({
    include: [
      {
        model: Lien,
        as: 'liens'
      },
      {
        model: DocumentPreparation,
        as: 'documentPreparation'
      },
      {
        model: EDDLien,
        as: 'eddLien'
      },
      {
        model: InjuredWorkerInformation,
        as: 'injuredWorkerInformation'
      },
      {
        model: InjuredWorkerOutreach,
        as: 'injuredWorkerOutreach'
      },
      {
        model: LienService,
        as: 'lienService'
      },
      {
        model: Walkthrough,
        as: 'walkthrough'
      },
      {
        model: Misc,
        as: 'misc'
      },
      {
        model: ServiceTag,
        as: 'tags'
      },
      {
        model: Claim,
        as: 'claims'
      },
      {
        model: ContactProfile,
        as: 'invoicer'
      },
      {
        model: ContactProfile,
        as: 'serviceOwner'
      },
      {
        model: ContactProfile,
        as: 'referredBy'
      },
      {
        model: ContactProfile,
        as: 'currentClaimHandler'
      },
      {
        model: Venue,
        as: 'venue'
      },
      {
        model: Venue,
        as: 'actualVenue'
      },
      {
        model: Judge,
        as: 'judge'
      },
      {
        model: ContactProfile,
        as: 'applicantAttorney'
      },
      {
        model: ServiceActions,
        as: 'serviceActions'
      },
      {
        model: Case,
        as: 'case'
      }
    ],
    where: {
      [Op.or]: [
        {
          judgeId: id
        }
      ]
    },
    order: [
      ['createdAt', 'DESC']
    ]
  })
};

const caseAlreadyAdded = (item, cases) => cases.filter(value => value.id === item.id).length;

const serviceIsSuspended = (service) => service.serviceActions.filter(action => (action.action === 'suspend') && !action.endDate).length;

const getSuspendedCases = (services) => {
  const cases = [];

  services.forEach(service => {
    if(serviceIsSuspended(service) && !caseAlreadyAdded(service.case, cases)) {
      cases.push(service.case);
    }
  });

  return cases;
};

export const getAllCases = (services) => {
  const cases = [];

  services.forEach(service => {
    if(!caseAlreadyAdded(service.case, cases)) {
      cases.push(service.case);
    }
  });

  return cases;
};

const getJudgeOverview = async (req) => {
  const services = await getAllServices(req.params.entityId);
  const cases = getAllCases(services);
  const walkthroughs = services
    .filter(service => !!service.walkthrough);
  const oneTimeSuspendedWalkthroughs = getOneTimeSuspendedServices(walkthroughs);

  return ({
    suspendedCases: getSuspendedCases(services).length,
    cases: cases.length,
    walkthroughApprovalRating: walkthroughs.length ? ((walkthroughs.length - oneTimeSuspendedWalkthroughs.length) / walkthroughs.length) * 100 : '-'
  });
};

export default getJudgeOverview;
