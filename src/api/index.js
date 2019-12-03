import { version } from '../../package.json';
import { Router } from 'express';
import validate from 'express-validation';
import validation from './validation';
import paginate from 'express-paginate';
import permission from 'permission';

import auth from './auth';
import exports from './exports';
import search from './search';
import custom from './custom';
import accountSettings from './custom/accountSettings';
import passwordResets from './custom/passwordResets';
import tags from './custom/tags';
import caseLists from './custom/caseLists';
import judgeLists from './custom/judgeLists';
import tracksActions from './custom/tracksActions';
import casesActions from './custom/casesActions';
import servicesActions from './custom/servicesActions';
import metrics from './custom/metrics';
import calendar from './custom/calendar';
import upload from './custom/upload';

import users from './resources/users';
import contactProfiles from "./resources/contactProfiles";
import judges from './resources/judges';
import venues from './resources/venues';
import organisations from './resources/organisations';
import tasks from './resources/tasks';
import tracks from './resources/tracks';
import resources from './resources/resources';
import cases from './resources/cases';
import services from './resources/services';
import eddLiens from './resources/eddLiens';
import notes from './resources/notes';
import authenticate from './concerns/authenticate';
import serviceTags from './resources/serviceTags';
import inPersonEvents from './resources/inPersonEvents';
import partnerCompanies from './resources/partnerCompanies';
import clientUpdates from './resources/clientUpdates';
import liens from './resources/liens';

export default ({ config, db }) => {
  const api = new Router({});

  api.use('/auth', auth);
  api.use('/reset-password', passwordResets);
  api.use(paginate.middleware(config.pagination.minLimit, config.pagination.maxLimit));
  api.use('/search', search);

  api.use('/users', authenticate, users({ config, db, validate, validation }));
  api.use('/contact-profiles', authenticate, permission(['user', 'admin']), contactProfiles({ config, db, validate, validation }));
  api.use('/judges', authenticate, permission(['user', 'admin']), judges({ config, db, validate, validation }));
  api.use('/judges/lists', authenticate, permission(['user', 'admin']), judgeLists);
  api.use('/venues', authenticate, permission(['user', 'admin']), venues({ config, db, validate, validation }));
  api.use('/organisations', authenticate, permission(['user', 'admin']), organisations({ config, db, validate, validation }));
  api.use('/tasks', authenticate, permission(['user', 'admin']), tasks({ config, db, validate, validation }));
  api.use('/tracks', authenticate, permission(['user', 'admin']), tracks({ config, db, validate, validation }));
  api.use('/resources', authenticate, permission(['user', 'admin']), resources({ config, db, validate, validation }));
  api.use('/cases', authenticate, permission(['user', 'admin']), cases({ config, db, validate, validation }));
  api.use('/cases/lists', authenticate, permission(['user', 'admin']), caseLists);
  api.use('/cases/:caseId/services', authenticate, permission(['user', 'admin']), services({ config, db, validate, validation }));
  api.use('/cases/:caseId/edd-liens', authenticate, permission(['user', 'admin']), eddLiens({ config, db, validate, validation }));
  api.use('/cases/:caseId/services/:serviceId/tags', authenticate, permission(['user', 'admin']), serviceTags({ config, db, validate, validation }));
  api.use('/cases/:caseId/services/:serviceId/partner-companies', authenticate, permission(['user', 'admin']), partnerCompanies({ config, db, validate, validation }));
  api.use('/cases/:caseId/services/:serviceId/client-updates', authenticate, permission(['user', 'admin']), clientUpdates({ config, db, validate, validation }));
  api.use('/notes', authenticate, permission(['user', 'admin']), notes({ config, db, validate, validation }));
  api.use('/in-person-events', authenticate, permission(['user', 'admin']), inPersonEvents({ config, db, validate, validation }));
  api.use('/liens', authenticate, permission(['user', 'admin']), liens({ config, db, validate, validation }));

  api.use('/files', authenticate, permission(['user', 'admin']), upload(db));
  api.use('/cases/actions', authenticate, casesActions);
  api.use('/services/actions', authenticate, servicesActions);
  api.use('/tracks/actions', authenticate, permission(['user', 'admin']), tracksActions(db));
  api.use('/calendar', authenticate, permission(['user', 'admin']), calendar);
  api.use('/metrics', authenticate, permission(['user', 'admin']), metrics);
  api.use('/exports', authenticate, permission(['user', 'admin']), exports);
  api.use('/tags', authenticate, permission(['user', 'admin']), tags);
  api.use('/account-settings', authenticate, permission(['user', 'admin']), accountSettings);
  api.use('/', custom);

  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};
