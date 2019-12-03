import {getAllCases, getAllServices, getOneTimeSuspendedServices} from "./contact";

const moment = require("moment");

const getContactOverview = async (req) => {
  const services = await getAllServices(req.params.entityId);
  const cases = await getAllCases(req.params.entityId);
  const walkthroughs = services
    .filter(service => !!service.walkthrough);
  const oneTimeSuspendedWalkthroughs = getOneTimeSuspendedServices(walkthroughs);

  const iwos = services
    .filter(service => !!service.injuredWorkerOutreach);
  const successIWOs = iwos.filter(iwo => iwo.result);

  return ({
    daySinceLastReferral: services[0] ? moment().diff(moment(services[0].createdAt), 'days') : '-',
    totalReferrals: cases.length,
    openCases: cases.length,
    walkthroughApprovalRating: walkthroughs.length ? ((walkthroughs.length - oneTimeSuspendedWalkthroughs.length) / walkthroughs.length) * 100 : '-',
    iwoSuccessRate: iwos.length ? (successIWOs.length / iwos.length) * 100 : '-'
  });
};

export default getContactOverview;
