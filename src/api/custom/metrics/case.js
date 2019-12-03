import { Op } from "sequelize";
const moment = require("moment");

const Model = require('../../../models/index').Case;
const Claim = require('../../../models/index').Claim;
const ContactProfile = require('../../../models/index').ContactProfile;
const Organisation = require('../../../models/index').Organisation;
const Service = require('../../../models/index').Service;
const DocumentPreparation = require('../../../models/index').DocumentPreparation;
const EDDLien = require('../../../models/index').EDDLien;
const InjuredWorkerInformation = require('../../../models/index').InjuredWorkerInformation;
const InjuredWorkerOutreach = require('../../../models/index').InjuredWorkerOutreach;
const LienService = require('../../../models/index').LienService;
const Walkthrough = require('../../../models/index').Walkthrough;
const Misc = require('../../../models/index').Misc;
const Venue = require('../../../models/index').Venue;
const Judge = require('../../../models/index').Judge;
const ServiceTag = require('../../../models/index').ServiceTag;
const ServiceActions = require('../../../models/index').ServiceActions;
const InPersonEvent = require('../../../models/index').InPersonEvent;
const Lien = require('../../../models/index').Lien;

export const getModel = (id) => {
  return Model.findById(id, {
    include: [
      {
        model: Claim,
        as: 'claims'
      },
      {
        model: ContactProfile,
        as: 'injuredWorker',
        include: [
          {
            model: Organisation,
            as: 'organisation'
          }
        ]
      },
      {
        model: Organisation,
        as: 'account'
      },
      {
        model: ContactProfile,
        as: 'referral'
      },
      {
        model: ContactProfile,
        as: 'caseOwner'
      },
      {
        model: Service,
        as: 'services',
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
        ]
      }
    ]
  });
};

const getProfile = (id) => {
  return ContactProfile.findOne({
    where: {
      id
    }
  })
};

const getDaysOnHold = (services) => {
  return services
    .reduce((sum, service) => sum + service.serviceActions.reduce((sum, serviceAction) => {
      if(serviceAction.action === 'hold') {
        return sum + moment(serviceAction.endDate).diff(moment(serviceAction.startDate), 'days');
      }

      return sum;
    }, 0), 0);
};

const getSuspensions = (services) => {
  return services
    .reduce((sum, service) => sum + service.serviceActions.reduce((count, serviceAction) => {
      if(serviceAction.action === 'suspend') {
        return count + 1;
      }

      return count;
    }, 0), 0);
};

const getTurnAroundTimes = (model, services) => {
  const turnAroundTimes = services
    .map(service => moment(service.serviceEnd).diff(moment(model.referralDate), 'days'));

  return turnAroundTimes.length ? (turnAroundTimes.reduce((sum, turnAroundTime) => sum + turnAroundTime, 0) / turnAroundTimes.length) : 0;
};

const getNumberOfAppearances = (model, profile) => {
  return InPersonEvent.count({
    where: {
      creatorId: profile.id,
    }
  });
};

const getNumberOfMeetings = (services) => {
  return InPersonEvent.count({
    where: {
      serviceId: {
        [Op.in]: services.map(service => service.id)
      },
    }
  });
};

export const getCostSavings = (service) => {
  if(!service) {
    return 0;
  }

  const settlementAmount = parseFloat(service.settlementAmount);
  const liens = service.liens;

  if(isNaN(settlementAmount) || settlementAmount === undefined || settlementAmount === null) {
    return 0;
  }

  if(!liens.length) {
    return 0;
  }

  const sum = liens.reduce((sum, lien) => {
    return sum + settlementAmount - lien.balance
  }, 0);

  return sum / liens.length;
};

const getAverageDaysToSettleLiens = (service) => {
  if(!service) {
    return 0;
  }

  const liens = service.liens;

  if(!liens.length) {
    return 0;
  }

  const sum = liens.reduce((sum, lien) => {
    return sum + moment(lien.dateOfServiceEnd).diff(moment(lien.dateOfServiceStart), 'days');
  }, 0);

  return sum / liens.length;
}

const getCaseMetrics = async (req) => {
  const model = await getModel(req.params.entityId);
  const profile = await getProfile(req.user.profileId);


  const walkthroughs = model.services
    .filter(service => !!service.walkthrough);
  const iwos = model.services
    .filter(service => !!service.injuredWorkerOutreach);
  const lienServices = model.services
    .filter(service => !!service.lienService);
  const iwms = model.services
    .filter(service => !!service.injuredWorkerInformation);
  const eddLiens = model.services
    .filter(service => !!service.eddLien);
  const miscs = model.services
    .filter(service => !!service.misc);

  const iwoDaysOnHold = getDaysOnHold(iwos);

  return ({
    walkthrough: {
      turnAroundTime: getTurnAroundTimes(model, walkthroughs),
      daysOnHold: getDaysOnHold(walkthroughs),
      numberOfSuspensions: getSuspensions(walkthroughs)
    },
    iwo: {
      turnAroundTime: getTurnAroundTimes(model, iwos),
      daysToObtainSignature: iwos.length ? iwos[0].injuredWorkerOutreach.daysToObtainSignature : 0,
      obtainedSignature: iwos.length ? !!iwos[0].injuredWorkerOutreach.signatureDateObtained: null,
      daysToHold: {
        count: iwoDaysOnHold,
        value: !!iwoDaysOnHold
      }
    },
    lienService: {
      turnAroundTime: getTurnAroundTimes(model, lienServices),
      daysOnHold: getDaysOnHold(lienServices),
      numberOfAppearances: await getNumberOfAppearances(model, profile),
      costSavings: getCostSavings(lienServices[0]),
      averageDaysToSettleLiens: getAverageDaysToSettleLiens(lienServices[0]),
    },
    iwm: {
      turnAroundTime: getTurnAroundTimes(model, iwms),
      daysOnHold: getDaysOnHold(iwms),
      numberOfMeetings: await getNumberOfMeetings(iwms)
    },
    eddLien: {
      turnAroundTime: getTurnAroundTimes(model, eddLiens),
      daysOnHold: getDaysOnHold(eddLiens)
    },
    misc: {
      turnAroundTime: getTurnAroundTimes(model, miscs),
      daysOnHold: getDaysOnHold(miscs)
    }
  });
};

export default getCaseMetrics;
