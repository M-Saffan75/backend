const express = require('express');
const Router = express;
const { Valid_User } = require('../middleware/auth_middleware');
const { Demo_Get_Task, Demo_Task_Create } = require('../controllers/freetask_controller');


const freetask_Router = Router()


/* Task Private Routes start Here */

/* Task Private Routes End Here */


/* Task Public Routes start Here */
freetask_Router.get('/free/fetch/task', Demo_Get_Task);
freetask_Router.post('/free/create/task', Demo_Task_Create);

/* Task Public Routes End Here */


module.exports = freetask_Router;