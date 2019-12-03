const Raven = require("raven");
const mail = require("../api/concerns/mail");
const moment = require("moment");
const Case = require('../models/index').Case;
const ContactProfile = require('../models/index').ContactProfile;
const Service = require('../models/index').Service;
const {Op} = require('sequelize');
const config = require('../config');

module.exports = async done => {
  try {
    const servicesNoClaimHandler = await Service.findAll({
      include: [
        {
          model: Case,
          as: "case",
          include: [
            {
              model: ContactProfile,
              as: 'injuredWorker'
            }
          ]
        },
        {
          model: ContactProfile,
          as: "serviceOwner"
        }
      ],
      where: {
        currentClaimHandlerId: null,
        hearingDate: {
          [Op.gte]: moment().add(45, "days").startOf("day").format(config.dateWithTimezone),
          [Op.lte]: moment().add(45, "days").endOf("day").format(config.dateWithTimezone)
        }
      },
      order: [
        ['id', 'DESC']
      ]
    }).map(item => ({
      caseId: item.case.id,
      hearingDate: item.hearingDate,
      serviceName: `${item.case.injuredWorker.firstName || ""} ${item.case.injuredWorker.lastName || ""} - ${item.serviceType} - ${item.id}`,
      serviceOwnerEmail: item.serviceOwner ? item.serviceOwner.email : null
    }));
    const servicesPrepareForHearing = await Service.findAll({
      include: [
        {
          model: Case,
          as: "case",
          include: [
            {
              model: ContactProfile,
              as: 'injuredWorker'
            }
          ]
        },
        {
          model: ContactProfile,
          as: "currentClaimHandler"
        },
        {
          model: ContactProfile,
          as: "serviceOwner"
        }
      ],
      where: {
        hearingDate: {
          [Op.gte]: moment().add(30, "days").startOf("day").format(config.dateWithTimezone),
          [Op.lte]: moment().add(30, "days").endOf("day").format(config.dateWithTimezone)
        }
      },
      order: [
        ['id', 'DESC']
      ]
    }).map(item => ({
      caseId: item.case.id,
      hearingDate: item.hearingDate,
      serviceName: `${item.case.injuredWorker.firstName || ""} ${item.case.injuredWorker.lastName || ""} - ${item.serviceType} - ${item.id}`,
      serviceOwnerEmail: item.serviceOwner ? item.serviceOwner.email : null,
      currentClaimHandlerName: item.currentClaimHandler ? `${item.currentClaimHandler.firstName} ${item.currentClaimHandler.lastName}` : "-"
    }));
    const servicesReconfirm = await Service.findAll({
      include: [
        {
          model: Case,
          as: "case",
          include: [
            {
              model: ContactProfile,
              as: 'injuredWorker'
            }
          ]
        },
        {
          model: ContactProfile,
          as: "currentClaimHandler"
        },
        {
          model: ContactProfile,
          as: "serviceOwner"
        }
      ],
      where: {
        hearingDate: {
          [Op.gte]: moment().add(7, "days").startOf("day").format(config.dateWithTimezone),
          [Op.lte]: moment().add(7, "days").endOf("day").format(config.dateWithTimezone)
        }
      },
      order: [
        ['id', 'DESC']
      ]
    }).map(item => ({
      caseId: item.caseId,
      hearingDate: item.hearingDate,
      serviceName: `${item.case.injuredWorker.firstName || ""} ${item.case.injuredWorker.lastName || ""} - ${item.serviceType} - ${item.id}`,
      serviceOwnerEmail: item.serviceOwner ? item.serviceOwner.email : null,
      serviceOwnerName: item.serviceOwner ? `${item.serviceOwner.firstName} ${item.serviceOwner.lastName}` : "-",
      currentClaimHandlerEmail: item.currentClaimHandler ? item.currentClaimHandler.email : null,
      currentClaimHandlerName: item.currentClaimHandler ? `${item.currentClaimHandler.firstName} ${item.currentClaimHandler.lastName}` : "-"
    }));
    await mail.sendHearingDateApproachingAlert({servicesNoClaimHandler, servicesPrepareForHearing, servicesReconfirm});
    done();
  } catch(err) {
    Raven.captureException(err);
    done(err);
  }
};
