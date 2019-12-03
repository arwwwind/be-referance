import response from "../concerns/response";
import exportFields from '../../config/exportFields';
import exportableEntities from '../../config/exportableEntities.json';
import exports from '../../config/exports.json';
import validate from "express-validation";
import validation from "../validation";
import {Op} from "sequelize";
import config from "../../config"
import Raven from "raven";
import {getDataFor} from "./repository"

const express = require('express');
const router  = express.Router();
const excel = require('../concerns/excel');
const pdf = require('../concerns/pdf');
const csv = require('../concerns/csv');

const User = require('../../models/index').User;
const ContactProfile = require('../../models/index').ContactProfile;
const Lien = require('../../models/index').Lien;
const Service = require('../../models/index').Service;
const Case = require('../../models/index').Case;
const Claim = require('../../models/index').Claim;
const DocumentPreparation = require('../../models/index').DocumentPreparation;
const EDDLien = require('../../models/index').EDDLien;
const InjuredWorkerInformation = require('../../models/index').InjuredWorkerInformation;
const InjuredWorkerOutreach = require('../../models/index').InjuredWorkerOutreach;
const LienService = require('../../models/index').LienService;
const Walkthrough = require('../../models/index').Walkthrough;
const Misc = require('../../models/index').Misc;
const moment = require('moment');

const getDbCollection = (entity) => {
  switch(entity["model"]) {
    case 'User': return User.findAll({
      include: [
        {
          model: ContactProfile,
          as: 'profile'
        }
      ],
      order: [
        ['id', 'ASC']
      ]
    });
    case 'ContactProfile': return ContactProfile.findAll({
      include: [
        {
          model: User,
          as: 'user'
        }
      ],
      order: [
        ['id', 'ASC']
      ]
    });
    case 'Case': return Case.findAll({
      include: [
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
            }
          ]
        }
      ],
      order: [
        ['id', 'ASC']
      ]
    });
    default:
      return require('../../models/index')[entity["model"]].findAll({
        order: [
          ['id', 'ASC']
        ]
      });
  }
};

router.post('/forms/:entity/:entityId', validate(validation.forms), async (req, res) => {
  try {
    pdf.generateForm(req.params.entity, getDataFor(req.params.entity, req.params.entityId), res, {orientation: "portrait"});
  } catch(err) {
    Raven.captureException(err);
    response(res).error(err, 500);
  }
});

router.post('/lien-reports',  validate(validation.lienReports), async ({ body }, res) => {

  try {
    const liens = await Lien.findAll({
      where:{
        claimentNameId: body.organisationId,
        [Op.and]: [
          {
            createdAt: {
              [Op.gte]:  body.startDate
            }
          }, {
            createdAt: {
              [Op.lte]:  body.endDate
            }
          },
        ]
      },
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
                  model: Claim,
                  as: "claims"
                }
              ]
            }
          ]
        }
      ]
    });

    const settledLiens = liens.filter(item => !!item.endDate).map(item => ({
      "caseClaimant": `${item.service.case.name} / ${item.service.case.claims ? item.service.case.claims[0].claimNumber : ""}`,
      "balance": item.balance,
      "settlement": item.service.case.caseSettlementAmount,
      "resolved": !!item.resolvedDate,
      "grossCostSavings": {
        replaceable: "1 - (C:i/B:i)"
      },
      "billed": "",
      "netCostSavings": {
        replaceable: "1 - ((C:i + F:i)/B:i)"
      },
      "status": item.service.status,
      "startDate": moment(item.dateOfServiceStart).format(config.dateWithTimezone),
      "settlementDate": moment(item.dateOfServiceEnd).format(config.dateWithTimezone),
      "turnAroundTime": moment(item.dateOfServiceEnd).diff(moment(item.dateOfServiceStart), "days")
    }));
    const unsettledLiens = liens.filter(item => !item.endDate).map(item => ({
      "caseClaimant": `${item.service.case.name} / ${item.service.case.claims ? item.service.case.claims[0].claimNumber : ""}`,
      "balance": item.balance,
      "billed": "",
      "startDate": moment(item.dateOfServiceStart).format(config.dateWithTimezone),
      "status": item.service.status
    }));

    const settledLiensCollection = excel.getSimpleExcelData(settledLiens, [
      "Case / Claimant", "Balance", "Settlement", "Resolved",
      "Gross Cost Savings", "Billed", "Net Cost Savings", "Status",
      "Start Date", "Settlement Date", "Turn Around Time"
    ]);
    const unsettledLiensCollection = excel.getSimpleExcelData(unsettledLiens, [
      "Case / Claimant", "Balance", "Billed", "Status", "Start Date"
    ]);
    excel.generateMultipleSheets(res, "LienReport", ["Settled Liens", "Unsettled Liens"], settledLiensCollection, unsettledLiensCollection)
  } catch(err) {
    res.send(err);
  }
});

router.post('/:entity/:format', async (req, res) => {
  if(exports.formats.indexOf(req.params["format"]) >= 0 && exportableEntities.hasOwnProperty(req.params["entity"])) {
    const entity = exportableEntities[req.params["entity"]];
    const table = entity["table"];
    const exportableFields = [...exportFields[table]];

    try {
      const dbCollection = await getDbCollection(entity).then(async items => {
        const ret = [];
        const labels = [];

        for(const item of items) {
          const entity = item.get({ plain: true });

          let key = 0;
          for(const field of exportableFields) {
            if(typeof field === 'function') {
              const custom = await field(item);
              entity[custom.label] = custom.value;

              if(!labels.filter(label => label.key === key).length) {
                labels.push({
                  key,
                  label: custom.label
                });
              }
            }

            key++;
          }

          ret.push(entity);
        }

        for(const label of labels) {
          exportableFields[label.key] = label.label;
        }

        return ret;
      });

      if(dbCollection) {
        switch(req.params["format"]) {
          case "xlsx":
            const data = excel.getExcelData(dbCollection, exportableFields);
            excel.generate(data, table, res);
            break;
          case "pdf":
            pdf.generate(dbCollection, exportableFields, entity, res, {orientation: "landscape"});
            break;
          case "csv":
            csv.generate(dbCollection, exportableFields, table, res);
            break;
          default:
            res.status(404).json(response(null).error('Not found'));
            break;
        }
      }
    } catch(err) {
      Raven.captureException(err);
      response(res).error(err, 500);
    }
  } else {
    res.status(404).json(response(null).error('Not found'));
  }
});

export default router;
