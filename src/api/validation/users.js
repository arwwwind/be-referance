import { alphanumeric, boolean } from './common';

export default {
  body: {
    firstName: alphanumeric().required(),
    lastName: alphanumeric().required(),
    loginEmail: alphanumeric().required(),
    userType: alphanumeric().required(),
    active: alphanumeric().required(),
    manager: boolean().required()
  }
}
