const express = require('express');
const Router = express;
const { Valid_User } = require('../middleware/auth_middleware');
const { Task_Create, Get_Task,Single_Task } = require('../controllers/task_controller');


const task_Router = Router()


/* Task Private Routes start Here */

// task_Router.use('/fetch/task', Valid_User);
task_Router.use('/create/task', Valid_User);
// task_Router.use('/single/task', Valid_User);

/* Task Private Routes End Here */


/* Task Public Routes start Here */

task_Router.post('/create/task/:id', Task_Create);
task_Router.get('/fetch/task', Get_Task);
task_Router.get('/single/task/:id', Single_Task);

/* Task Public Routes End Here */


module.exports = task_Router;