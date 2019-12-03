import Joi from 'joi';
import { alphanumeric, boolean } from './common';

export default {
  body: {
    name: alphanumeric().required(),
    abbreviation: alphanumeric().required(),
    address: alphanumeric(),
    canWeSelectJudge: boolean(),
    sameDayAdj: boolean(),
    walkThroughSchedule: alphanumeric(),
    IAOfficers: Joi.array(),
    EDDReps: Joi.array()
  }
}
