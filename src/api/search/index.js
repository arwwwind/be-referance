import permission from 'permission';
import authenticate from '../concerns/authenticate';
import validate from 'express-validation';
import validation from '../validation';

import searchContactProfiles from "./contactProfiles";
import searchContactProfilesType from "./contactProfilesType";
import searchJudges from "./judges";
import searchOrganisations from "./organisations";
import searchOrganisationsType from "./organisationsType";
import searchVenues from "./venues";
import searchCases from "./cases";
import searchNotes from "./notes";
import searchTags from "./tags";
import searchInPersonEvents from "./inPersonEvents";
import searchPartnerServices from "./partnerServices";
import searchClientUpdates from "./clientUpdates";
import searchLiens from "./liens";
import searchServices from "./services";

const express = require('express');
const router  = express.Router();

router.get("/contact-profiles", authenticate, permission(["user", "admin"]), searchContactProfiles);
router.get("/contact-profiles/:type", authenticate, permission(["user", "admin"]), validate(validation.contactProfilesSearch), searchContactProfilesType);
router.get("/judges", authenticate, permission(["user", "admin"]), searchJudges);
router.get("/organisations", authenticate, permission(["user", "admin"]), searchOrganisations);
router.get("/organisations/:type", authenticate, permission(["user", "admin"]), validate(validation.organisationsSearch), searchOrganisationsType);
router.get("/venues", authenticate, permission(["user", "admin"]), searchVenues);
router.get("/cases", authenticate, permission(["user", "admin"]), searchCases);
router.get("/notes", authenticate, permission(["user", "admin"]), validate(validation.notes.index), searchNotes);
router.get("/tags", authenticate, permission(["user", "admin"]), searchTags);
router.get("/in-person-events", authenticate, permission(["user", "admin"]), validate(validation.inPersonEvents.index), searchInPersonEvents);
router.get("/partner-companies", authenticate, permission(["user", "admin"]), validate(validation.partnerServices.index), searchPartnerServices);
router.get("/client-updates", authenticate, permission(["user", "admin"]), validate(validation.clientUpdates.index), searchClientUpdates);
router.get("/liens", authenticate, permission(["user", "admin"]), validate(validation.liens.index), searchLiens);
router.get("/services", authenticate, permission(["user", "admin"]), searchServices);

export default router;
