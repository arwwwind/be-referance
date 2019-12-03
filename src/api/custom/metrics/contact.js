import { Op } from "sequelize";
const moment = require("moment");

const Model = require('../../../models/index').ContactProfile;
const ContactProfile = Model;
const Organisation = require('../../../models/index').Organisation;
const Case = require('../../../models/index').Case;
const User = require('../../../models/index').User;
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
const InPersonEvent = require('../../../models/index').InPersonEvent;
const Lien = require('../../../models/index').Lien;

const getModel = (id) => {
  return Model.findById(id, {
    include: [
      {
        model: Organisation,
        as: "organisation"
      },
      {
        model: Organisation,
        as: "accounts"
      },
      {
        model: Venue,
        as: "VenuesWhereBoardReps"
      },
      {
        model: User,
        as: "user",
        attributes: {
          exclude: [
            "password",
            "userImage"
          ]
        }
      }
    ],
    attributes: {
      exclude: [
        "userImage"
      ]
    }
  });
};

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
          currentClaimHandlerId: id
        }, {
          serviceOwnerId: id
        }, {
          referredById: id
        }, {
          applicantAttorneyId: id
        }
      ]
    },
    order: [
      ['createdAt', 'DESC']
    ]
  })
};

export const getAllCases = (id) => {
  return Case.findAll({
    where: {
      [Op.or]: [
        {
          referralId: id
        }, {
          caseOwnerId: id
        }, {
          injuredWorkerId: id
        }
      ]
    },
  })
};

const getTurnAroundTimes = (services) => {
  const turnAroundTimes = services
    .map(service => moment(service.serviceEnd).diff(moment(service.case.referralDate), 'days'));

  return turnAroundTimes.length ? (turnAroundTimes.reduce((sum, turnAroundTime) => sum + turnAroundTime, 0) / turnAroundTimes.length) : 0;
};

const getSavings = (services) => {
  if(!services.length) {
    return 0;
  }

  const savings = [];

  services.forEach(service => {
    const settlementAmount = parseFloat(service.settlementAmount);
    const liens = service.liens;

    if(isNaN(settlementAmount) || settlementAmount === undefined || settlementAmount === null) {
      return;
    }

    if(!liens.length) {
      return;
    }

    liens.forEach(lien => {
      savings.push(settlementAmount - lien.balance);
    });
  });

  return savings;
};

const getCostSavings = (savings) => savings.length ? (savings.reduce((ret, sum) => ret + sum, 0) / savings.length) : 0;

const getMedianCostSavings = (values) => {
  if(!values.length) {
    return 0;
  }

  values.sort((a, b) => a - b);

  if(values.length === 0) {
    return 0;
  }

  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];
  else
    return (values[half - 1] + values[half]) / 2.0;
};

const getLienTurnAroundTime = (services) => {
  if(!services.length) {
    return 0;
  }

  const days = [];

  services.forEach(service => {
    const liens = service.liens;

    if(!liens.length) {
      return;
    }

    liens.forEach(lien => {
      days.push(moment(lien.dateOfServiceEnd).diff(moment(lien.dateOfServiceStart), 'days'));
    });
  });

  return days.length ? (days.reduce((ret, sum) => ret + sum, 0) / days.length) : 0;
};

const getInPersonEvents = (id) => {
  return InPersonEvent.findAll({
    where: {
      creatorId: id,
    },
    order: [
      ['createdAt', 'DESC']
    ]
  });
};

const getRatedInPersonEvents = (events) => events.filter(event => !!event.rating);

const getAverageRate = (events) => events.length ? (events.reduce((ret, event) => ret + parseInt(event.rating, 10), 0) / events.length) : 0;

const getNumberOfInjuredWorkerMeetings = (events) => events.filter(event => event.type === 'Injured Worker Meeting');

const getNumberOfLienAppearances = (events) => events.filter(event => event.type === 'Lien Appearances');

export const getOneTimeSuspendedServices = (services) => {
  return services.filter(service => service.serviceActions.filter(action => action.suspend === 'suspend').length);
};

const getLienClosureRatio = (services) => {
  let total = 0;
  let closed = 0;

  services.forEach(service => {
    total += service.liens.length;

    service.liens.forEach(lien => {
      if(moment().diff(moment(lien.dateOfServiceEnd), 'days') > 0) {
        closed += 1;
      }
    })
  });

  return `${closed}:${total}`;
};

const getContactMetrics = async (req) => {
  const model = await getModel(req.params.entityId);
  const services = await getAllServices(req.params.entityId);
  const cases = await getAllCases(req.params.entityId);
  const events = await getInPersonEvents(req.params.entityId);
  const ratedEvents = getRatedInPersonEvents(events);

  const iwos = services
    .filter(service => !!service.injuredWorkerOutreach);
  const successIWOs = iwos.filter(iwo => iwo.result);
  const convertedIWOs = iwos.filter(iwo => !!iwo.signatureDateObtained);

  const walkthroughs = services
    .filter(service => !!service.walkthrough);
  const savings = getSavings(services);
  const oneTimeSuspendedWalkthroughs = getOneTimeSuspendedServices(walkthroughs);

  return ({
    internalUserLayout: {
      daySinceLastReferral: services[0] ? moment().diff(moment(services[0].createdAt), 'days') : '-',
      openCases: cases.length,
      walkthroughApprovalRating: walkthroughs.length ? ((walkthroughs.length - oneTimeSuspendedWalkthroughs.length) / walkthroughs.length) * 100 : '-',
      iwoSuccessRate: iwos.length ? (successIWOs.length / iwos.length) * 100 : '-',
      iwoSuccessRatio: iwos.length ? (convertedIWOs.length / iwos.length) * 100 : '-',
      iwoAvgTurnAroundTime: getTurnAroundTimes(iwos),
      walkthroughTurnAroundTime: getTurnAroundTimes(walkthroughs),
      lienClosureRatio: getLienClosureRatio(services),
      avgCostSavings: getCostSavings(savings),
      medianCostSavings: getMedianCostSavings(savings),
      turnAroundTime: getLienTurnAroundTime(services),
      numberInPersonEvents: events.length,
      averageRating: {
        count: getAverageRate(ratedEvents),
        value: ratedEvents.length ? ratedEvents[0].rating : 0
      },
      lastRating: {
        date: ratedEvents.length ? ratedEvents[0].createdAt : 0,
        value: ratedEvents.length ? ratedEvents[0].rating : 0
      },
      injuredWorkerMeetings: getNumberOfInjuredWorkerMeetings(events),
      lienAppearance: getNumberOfLienAppearances(events)
    },
    externalRepresentative: {
      numberInPersonEvents: events.length,
      walkthroughApprovalRating: walkthroughs.length ? ((walkthroughs.length - oneTimeSuspendedWalkthroughs.length) / walkthroughs.length) * 100 : '-',
      costSavings: getCostSavings(savings),
      averageRating: {
        count: getAverageRate(ratedEvents),
        value: ratedEvents.length ? ratedEvents[0].rating : 0
      },
      lastRating: {
        date: ratedEvents.length ? ratedEvents[0].createdAt : 0,
        value: ratedEvents.length ? ratedEvents[0].rating : 0
      },
      injuredWorkerMeetings: getNumberOfInjuredWorkerMeetings(events),
      lienAppearance: getNumberOfLienAppearances(events),
      walkthrough: getTurnAroundTimes(walkthroughs)
    },
    contactType: model.contactType,
    contactName: `${model.firstName} ${model.lastName}`
  })
};

export default getContactMetrics;
