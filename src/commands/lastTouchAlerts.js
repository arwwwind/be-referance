const Raven = require("raven");
const mail = require("../api/concerns/mail");
const moment = require("moment");
const User = require('../models/index').User;
const Case = require('../models/index').Case;
const ContactProfile = require('../models/index').ContactProfile;
const {Op} = require('sequelize');
const config = require('../config');

module.exports = async done => {
  try {
    const arrayOfRecipients = (await User.findAll({where:{userType: "admin"}})).map(item => item.loginEmail);
    const cases = await Case.findAll({
      include: [
        {
          model: ContactProfile,
          as: 'caseOwner'
        }
      ],
      where: {
        notifyLastTouch: {
          [Op.ne]: null,
          [Op.gte]: moment().startOf('day').format(config.dateWithTimezone),
          [Op.lte]: moment().endOf('day').format(config.dateWithTimezone)
        }
      },
      order: [
        ['id', 'DESC']
      ]
    }).map(item => ({
      caseId: item.id,
      caseName: item.name,
      caseCoordinator: item.caseOwner ? item.caseOwner.email : null,
      notifyLastTouchDaysNo: item.notifyLastTouchDaysNo
    }));
    await mail.sendLastTouchAlert(arrayOfRecipients, cases);
    done();
  } catch(err) {
    Raven.captureException(err);
    done(err);
  }
};
