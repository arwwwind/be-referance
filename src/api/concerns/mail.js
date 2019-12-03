'use strict';
const mail = require('../../config/mail.json');
const config = require('../../config.json');
const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
const Raven = require("raven");
const _ = require('lodash');
const Notification = require('../../models/index').Notification;

const mailgun = require('nodemailer-mailgun-transport');
const env = process.env.NODE_ENV || "development";
const optionsMailtrap = {
  host: mail.mailtrap.host,
  port: mail.mailtrap.port,
  auth: {
    user: mail.mailtrap.user,
    pass: mail.mailtrap.pass
  }
};

const optionsMailgun = mailgun({
  auth: {
    api_key: mail.mailgun.key,
    domain: mail.mailgun.domain
  }
});

const generalTransport = nodemailer.createTransport(env === "development" ? optionsMailtrap : optionsMailgun);

/**
 * Sends an email (not to be used directly)
 *
 * @param options
 */
const send = (options) => {
  return new Promise((resolve, reject) => {
    generalTransport.sendMail(options, (err, info) => {
      if(err) {
        reject(err);
      } else {
        resolve(info);
      }
    })
  });
};

/**
 * Sends a html email.
 *
 * @param options (object) -> see nodemailer docs
 * @param html (object) -> params: "path" for simple html or "content" for inline html or template
 */
const sendHtml = async (options, html) => {
  if(html.hasOwnProperty("path")) {
    options.html = {path: html.path};
  } else if(html.hasOwnProperty("content")) {
    options.html = html.content;
  }
  await send(options).catch(err => Raven.captureException(err));
};

/**
 * Sends an email using a template formed in EJS
 * Calls sendHtml and manages parameters accordingly.
 *
 * @param mailOptions (See nodemailer docs)
 * @param contentOptions -> "path" & "parameters" required
 *
 * Example:
 * sendTemplateEmail({
 *       from: config.defaultFrom, // sender address
 *       to: "newUser@mail.com",
 *       subject: 'Account created', // Subject line
 *   }, {
 *       path: path.resolve(__dirname, '../../templates/emails/accountCreated.ejs'),
 *       parameters: {
 *          password: "asd123"
 *       }
 *   });
 * @param notification
 */
const sendTemplateEmail = (mailOptions, contentOptions, notification = false) => {
  return new Promise((accept, reject) => {
    ejs.renderFile(contentOptions.path, contentOptions.parameters, async (err, data) => {
      if(err) {
        return reject(err);
      }
      if(notification) {
        await Notification.create({email: mailOptions.to, name: mailOptions.subject, content: data});
      }
      await sendHtml(mailOptions, {content: data});
      accept();
    })
  });
};

/**
 * Sends an email to the user, notifying him that an admin created his account.
 * The template used is default. Use "sendHtml" if you want to use a custom template or inline html.
 *
 * @param to
 * @param password
 */
const sendAccountCreated = (to, password) => {

  sendTemplateEmail({
    from: mail.defaultFrom, // sender address
    to: to,
    subject: 'Account created' // Subject line
  }, {
    path: path.resolve(__dirname, '../../templates/emails/accountCreated.ejs'),
    parameters: {
      password: password
    }
  });
};

/**
 * Sends an email to the user, with a link to reset password.
 * The template used is default. Use "sendHtml" if you want to use a custom template or inline html.
 *
 * @param to
 * @param token
 */
const sendPasswordReset = (to, token) => {
  sendTemplateEmail({
    from: mail.defaultFrom, // sender address
    to: to,
    subject: 'Password reset' // Subject line
  }, {
    path: path.resolve(__dirname, '../../templates/emails/resetPassword.ejs'),
    parameters: {
      url: config.appUrl + "/reset-password/" + token
    }
  });
};

/**
 * Sends an email to the client, with a specified body.
 * The template used is default. Use "sendHtml" if you want to use a custom template or inline html.
 *
 * @param body
 * @param from
 * @param options
 */
const sendClientUpdate = (body, from, options) => {
  sendTemplateEmail({
    from: from, // sender address
    to: body.email,
    subject: body.subject // Subject line
  }, {
    path: path.resolve(__dirname, '../../templates/emails/clientUpdates.ejs'),
    parameters: {
      body: body.body,
      pixelUrl: config.apiUrl + options.pixelPath
    }
  });
};

/**
 * Sends an email to the recipients, with a request for deletion.
 * The template used is default. Use "sendHtml" if you want to use a custom template or inline html.
 *
 * @param username
 * @param arrayOfRecipients
 * @param message
 * @param entity
 * @param url
 */
const sendRequestDelete = (arrayOfRecipients, username, message, entity, url) => {
  for(const to of arrayOfRecipients) {
    sendTemplateEmail({
      from: mail.defaultFrom, // sender address
      to: to,
      subject: "Request to delete a " + entity // Subject line
    }, {
      path: path.resolve(__dirname, '../../templates/emails/deleteRequest.ejs'),
      parameters: {
        username,
        message,
        entity,
        url
      }
    });
  }
};

/**
 * Sends a "No task" alert to an array of recipients
 *
 * @param arrayOfRecipients
 * @param data
 */
const sendNoTaskAlert = async (arrayOfRecipients, data) => {
  for(const item of data) {
    const tos = _.union(arrayOfRecipients, item.caseCoordinator);
    for(const to of tos) {
      await sendTemplateEmail({
        from: mail.defaultFrom, // sender address
        to: to,
        subject: "No task alert for " + item.serviceName // Subject line
      }, {
        path: path.resolve(__dirname, '../../templates/emails/noTaskAlert.ejs'),
        parameters: {
          url: config.appUrl + "/case/" + item.caseId,
          item
        }
      }, true);
    }
  }
};

/**
 * Sends a "last touch" alert to an array of recipients
 *
 * @param arrayOfRecipients
 * @param data -> array of {caseId, caseName, caseCoordinator, notifyLastTouchDaysNo}
 */
const sendLastTouchAlert = async (arrayOfRecipients, data) => {
  for(const item of data) {
    const tos = _.union(arrayOfRecipients, item.caseCoordinator);
    for(const to of tos) {
      await sendTemplateEmail({
        from: mail.defaultFrom, // sender address
        to: to,
        subject: "Last touch alert for " + item.caseName // Subject line
      }, {
        path: path.resolve(__dirname, '../../templates/emails/lastTouchAlert.ejs'),
        parameters: {
          url: config.appUrl + "/case/" + item.caseId,
          caseName: item.caseName,
          daysSinceLastUpdate: item.notifyLastTouchDaysNo
        }
      }, true);
    }
  }
};

/**
 * Sends a "case update" alert to an array of recipients
 *
 * @param arrayOfRecipients
 * @param data
 */
const sendCaseUpdateAlert = async (arrayOfRecipients, data) => {
  for(const item of data) {
    const tos = _.union(arrayOfRecipients, item.caseCoordinator);
    for(const to of tos) {
      await sendTemplateEmail({
        from: mail.defaultFrom, // sender address
        to: to,
        subject: "Last touch alert for " + item.caseName // Subject line
      }, {
        path: path.resolve(__dirname, '../../templates/emails/caseUpdateAlert.ejs'),
        parameters: {
          url: config.appUrl + "/case/" + item.caseId,
          item
        }
      }, true);
    }
  }
};

/**
 * Sends a "hearing date approaching" alert
 *
 * @param services
 */
const sendHearingDateApproachingAlert = async (services) => {
  /** 45 day notification only is send when there is a hearing date but no “assigned representative.”*/
  for(const service of services.servicesNoClaimHandler) {
    if(service.serviceOwnerEmail) {
      await sendTemplateEmail({
        from: mail.defaultFrom,
        to: service.serviceOwnerEmail,
        subject: "Hearing date approaching - no assigned representative - " + service.serviceName
      }, {
        path: path.resolve(__dirname, '../../templates/emails/noClaimHandlerAlert.ejs'),
        parameters: {
          url: config.appUrl + "/case/" + service.caseId,
          service
        }
      }, true);
    }
  }
  /** 30 day notification reminds service owner to prepare case for hearing. */
  for(const service of services.servicesPrepareForHearing) {
    if(service.serviceOwnerEmail) {
      await sendTemplateEmail({
        from: mail.defaultFrom,
        to: service.serviceOwnerEmail,
        subject: "Hearing date approaching - prepare case for hearing - " + service.serviceName
      }, {
        path: path.resolve(__dirname, '../../templates/emails/prepareForHearingAlert.ejs'),
        parameters: {
          url: config.appUrl + "/case/" + service.caseId,
          service
        }
      }, true);
    }
  }
  /** 7 day notification reminds service owner to reconfirm with “assigned representative” that they are indeed attending the hearing. */
  for(const service of services.servicesReconfirm) {
    if(service.serviceOwnerEmail) {
      await sendTemplateEmail({
        from: mail.defaultFrom,
        to: service.serviceOwnerEmail,
        subject: "Hearing date approaching - reconfirm representative - " + service.serviceName
      }, {
        path: path.resolve(__dirname, '../../templates/emails/reconfirmRepresentativeAlert.ejs'),
        parameters: {
          url: config.appUrl + "/case/" + service.caseId,
          service
        }
      }, true);
    }
  }
  /** Email notification sent to the “assigned rep”. */
  for(const service of services.servicesReconfirm) {
    if(service.currentClaimHandlerEmail) {
      await sendTemplateEmail({
        from: mail.defaultFrom,
        to: service.currentClaimHandlerEmail,
        subject: "Hearing date approaching - " + service.serviceName
      }, {
        path: path.resolve(__dirname, '../../templates/emails/representativeAlert.ejs'),
        parameters: {
          url: config.appUrl + "/case/" + service.caseId,
          service
        }
      }, true);
    }
  }
};

/**
 * Sends an "in person event" alert to an array of recipients
 *
 * @param arrayOfRecipients
 * @param data
 */
const sendInPersonEventAlert = async (arrayOfRecipients, data) => {
  for(const item of data) {
    const tos = _.union(arrayOfRecipients, item.caseCoordinator);
    for(const to of tos) {
      if(to) {
        await sendTemplateEmail({
          from: mail.defaultFrom, // sender address
          to: to,
          subject: "In person event with no client update"// Subject line
        }, {
          path: path.resolve(__dirname, '../../templates/emails/inPersonEventAlert.ejs'),
          parameters: {
            url: config.appUrl + "/case/" + item.caseId,
            item
          }
        }, true);
      }
    }
  }
};

module.exports = {
  sendHtml,
  sendAccountCreated,
  sendPasswordReset,
  sendClientUpdate,
  sendRequestDelete,
  sendNoTaskAlert,
  sendLastTouchAlert,
  sendCaseUpdateAlert,
  sendHearingDateApproachingAlert,
  sendInPersonEventAlert
};
