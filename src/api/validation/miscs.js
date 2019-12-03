import Joi from 'joi';
import { alphanumeric } from './common';

export default {
    body: {
        tag: alphanumeric()
    }
}
