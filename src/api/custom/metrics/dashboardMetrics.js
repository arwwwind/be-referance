const Case = require('../../../models/index').Case;
const ContactProfile = require('../../../models/index').ContactProfile;
const Organisation = require('../../../models/index').Organisation;
const Service = require('../../../models/index').Service;
const ServiceActions = require('../../../models/index').ServiceActions;
const moment = require("moment");

const getAllCases = () => Case.findAll({
  include: [
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
      model: Service,
      as: 'services',
      include: [
        {
          model: ServiceActions,
          as: 'serviceActions'
        }
      ]
    }
  ]
});

const getNewCases = (cases) => cases.filter(item => moment().subtract(1, 'week').diff(moment(item.createdAt), 'days') <= 0);

const getOldCases = (cases) => cases.filter(item => moment().subtract(1, 'week').diff(moment(item.createdAt), 'days') > 0);

const getInjuredWorkerCases = (cases) => cases.filter(item => !!item.injuredWorker);

const getOutstandingCases = (cases) => cases.filter(item => !item.services.filter(service => service.serviceActions.filter(action => (action.action === 'suspend') && !action.endDate).length).length);

const getDashboardMetrics = async (req) => {
  const cases = await getAllCases();

  return ({
    outstandingCases: getOutstandingCases(cases).length,
    injuredWorkerCases: getInjuredWorkerCases(cases).length,
    newCases: getNewCases(cases).length,
    oldCases: getOldCases(cases).length
  })
};

export default getDashboardMetrics;
