const Raven = require("raven");
const mail = require("../api/concerns/mail");
const moment = require("moment");
const User = require('../models/index').User;
const Case = require('../models/index').Case;
const ContactProfile = require('../models/index').ContactProfile;
const Organisation = require('../models/index').Organisation;
const Service = require('../models/index').Service;
const {Op} = require('sequelize');
const config = require('../config');
const constants = require('../config/constants');

module.exports = async done => {
  try {
    const arrayOfRecipients = (await User.findAll({where:{userType: "admin"}})).map(item => item.loginEmail);
    const cases = await Case.findAll({
      include: [
        {
          model: ContactProfile,
          as: 'caseOwner'
        },
        {
          model: ContactProfile,
          as: 'referral'
        },
        {
          model: Organisation,
          as: 'account'
        },
        {
          model: Service,
          as: "services"
        }
      ],
      where: {
        adjusterUpdatedAt: {
          [Op.lte]: moment().subtract(constants.adjusterUpdatedIn, "days").startOf("day").format(config.dateWithTimezone)
        }
      },
      order: [
        ['id', 'DESC']
      ]
    }).map(item => ({
      caseId: item.id,
      caseName: item.name,
      caseCoordinator: item.caseOwner ? item.caseOwner.email : null,
      caseCoordinatorName: item.caseOwner ? `${item.caseOwner.firstName} ${item.caseOwner.lastName}` : "-",
      adjuster: item.referral ? `${item.referral.firstName} ${item.referral.lastName}` : "-",
      account: item.account ? item.account.companyName: '-',
      servicesNotUpdated: item.services ? item.services.map(service => service.serviceType).join(', ') : '-',
      daysSinceLastUpdate: moment().diff(moment(item.adjusterUpdatedAt), "days")
    }));
    await mail.sendCaseUpdateAlert(arrayOfRecipients, cases);
    done();
  } catch(err) {
    Raven.captureException(err);
    done(err);
  }
};
