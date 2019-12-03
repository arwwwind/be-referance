import { getCostSavings, getModel } from './case';

const moment = require("moment");

const getSettledLiens = (service) => {
  const liens = service.liens;

  if(!liens.length) {
    return 0;
  }

  return liens.filter(lien => moment().diff(moment(lien.dateOfServiceEnd), 'days') > 0).length;
};

const getLienServiceOverView = async (req) => {
  const model = await getModel(req.params.entityId);

  const lienServices = model.services
    .filter(service => !!service.lienService);

  const settledLiens = getSettledLiens(lienServices[0]);

  return ({
    costSavings: lienServices[0] ? getCostSavings(lienServices[0]) : '-',
    outstandingLiens: lienServices[0] ? lienServices[0].liens.length - settledLiens : '-',
    settledLiens: lienServices[0] ? settledLiens : '-'
  });
};

export default getLienServiceOverView;
