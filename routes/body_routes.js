const express = require('express');
const Router = express;
const { Valid_User } = require('../middleware/auth_middleware');
const { Create_User_Body, Get_User_Body,Update_Body } = require('../controllers/body_controller');


const body_Router = Router()


/* Task Private Routes start Here */

body_Router.use('/create/body', Valid_User);
body_Router.use('/fetch/body/data', Valid_User);
body_Router.use('/update/body', Valid_User);

/* Task Private Routes start Here */


/* Task Public Routes start Here */

body_Router.post('/create/body', Create_User_Body);
body_Router.post('/update/body', Update_Body);
body_Router.get('/fetch/body/data', Get_User_Body);

/* Task Public Routes start Here */


module.exports = body_Router;
