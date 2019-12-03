import permission from 'permission';
import authenticate from '../concerns/authenticate';
import validate from 'express-validation';
import validation from '../validation';

import completeTasks from './completeTasks';
import inCompleteTasks from './inCompleteTasks';
import getMyTasks from "./getMyTasks";
import getCaseTasks from "./getCaseTasks";
import getServiceTasks from "./getServiceTasks";
import getNotifications from "./getNotifications";
import changeUserStatus from "./changeUserStatus";
import pixelTracking from "./pixelTracking";

const express = require('express');
const router  = express.Router();

router.post("/complete-tasks/:id", authenticate, permission(["user", "admin"]), validate(validation.custom.completeTasks), completeTasks);
router.post("/incomplete-tasks/:id", authenticate, permission(["user", "admin"]), validate(validation.custom.inCompleteTasks), inCompleteTasks);
router.get("/my-tasks", authenticate, permission(["user", "admin"]), validate(validation.custom.myTasks), getMyTasks);
router.get("/case-tasks", authenticate, permission(["user", "admin"]), validate(validation.custom.caseTasks), getCaseTasks);
router.get("/service-tasks", authenticate, permission(["user", "admin"]), validate(validation.custom.serviceTasks), getServiceTasks);
router.use("/client-update", validate(validation.custom.pixel), pixelTracking("clientUpdate"));
router.get("/notifications", authenticate, permission(["user", "admin"]), getNotifications);
router.patch("/users/:id", authenticate, permission(["admin"]), validate(validation.custom.userStatus), changeUserStatus);

export default router;
