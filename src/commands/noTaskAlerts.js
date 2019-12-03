const Raven = require("raven");
const mail = require("../api/concerns/mail");
const moment = require("moment");
const User = require('../models/index').User;
const Case = require('../models/index').Case;
const Service = require('../models/index').Service;
const Task = require('../models/index').Tasks;
const Resource = require('../models/index').Resource;
const ContactProfile = require('../models/index').ContactProfile;
const Organisation = require('../models/index').Organisation;
const {Op} = require('sequelize');

module.exports = async done => {
  try {
    const arrayOfRecipients = (await User.findAll({where:{userType: "admin"}})).map(item => item.loginEmail);
    const servicesThatHaveTasks = await Task.findAll({include: [{model: Resource, as: "resource"}]}).filter(item => item.resource).map(item => item.resource.serviceId);

    /** Services that do not have tasks and belong to open cases */
    const services = await Service.findAll({
      include: [
        {
          model: Case,
          as: "case",
          include: [
            {
              model: ContactProfile,
              as: 'caseOwner'
            },
            {
              model: Service,
              as: "services"
            },
            {
              model: Organisation,
              as: 'account'
            },
            {
              model: ContactProfile,
              as: 'injuredWorker'
            }
          ]
        }
      ],
      where: {
        id: {
          [Op.notIn]: servicesThatHaveTasks
        }
      },
      order: [
        ['id', 'DESC']
      ]
    }).map(item => ({
      caseId: item.caseId,
      serviceName: `${item.case.injuredWorker.firstName || ""} ${item.case.injuredWorker.lastName || ""} - ${item.serviceType} - ${item.id}`,
      caseCoordinator: item.case.caseOwner ? item.case.caseOwner.email : null,
      caseName: item.case.name,
      caseStatus: item.case.status,
      caseCoordinatorName: item.case.caseOwner ? `${item.case.caseOwner.firstName} ${item.case.caseOwner.lastName}` : "-",
      account: item.account ? item.account.companyName: '-',
      services: item.case.services ? item.case.services.map(item => item.serviceType).join(', ') : '-',
      referralDate: item.case.referralDate ? moment(item.case.referralDate).format("MM/DD/YYYY HH:mm:ss") : '-'
    }));
    await mail.sendNoTaskAlert(arrayOfRecipients, services);
    done();
  } catch(err) {
    Raven.captureException(err);
    done(err);
  }
};
