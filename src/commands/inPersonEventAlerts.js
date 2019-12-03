const Raven = require("raven");
const mail = require("../api/concerns/mail");
const moment = require("moment");
const User = require('../models/index').User;
const InPersonEvent = require('../models/index').InPersonEvent;
const ClientUpdate = require('../models/index').ClientUpdate;
const Service = require('../models/index').Service;
const Case = require('../models/index').Case;
const ContactProfile = require('../models/index').ContactProfile;
const {Op} = require('sequelize');
const config = require('../config');

module.exports = async done => {
  try {
    const arrayOfRecipients = (await User.findAll({where:{userType: "admin"}})).map(item => item.loginEmail);
    const servicesWithClientUpdates = (await ClientUpdate.findAll({where:{createdAt: {[Op.gte]: moment().subtract(1, "day").format(config.dateWithTimezone)}}}))
      .map(item => item.serviceId);
    const inPersonEvents = await InPersonEvent.findAll({
      include: [
        {
          model: Service,
          as: "service",
          include: [
            {
              model: Case,
              as: "case",
              include: [
                {
                  model: ContactProfile,
                  as: 'caseOwner'
                }
              ]
            }
          ]
        }
      ],
      where: {
        dateTime: {
          [Op.lte]: moment().subtract(1, "day").format(config.dateWithTimezone),
          [Op.gte]: moment().subtract(2, "days").format(config.dateWithTimezone)
        },
        serviceId: {
          [Op.notIn]: servicesWithClientUpdates
        }
      },
      order: [
        ['id', 'DESC']
      ]
    }).map(item => ({
      caseId: item.service.caseId,
      description: item.description,
      dateTime: item.dateTime,
      caseCoordinator: item.service.case.caseOwner ? item.service.case.caseOwner.email : null
    }));
    await mail.sendInPersonEventAlert(arrayOfRecipients, inPersonEvents);
    done();
  } catch(err) {
    Raven.captureException(err);
    done(err);
  }
};
