import Joi from "joi";

export const alphanumeric = () => Joi.alternatives().try(Joi.string(), Joi.number());

export const numeric = () => Joi.number();

export const boolean = () => Joi.boolean();
