const express = require('express');
const Router = express;
const { Valid_User } = require('../../middleware/auth_middleware');
const { SubWorkCreate, Single_SubWorkout, SubWorkout_Approve } = require('../../controllers/admin/subwork_controller');


const subwork_Router = Router()


/* subworkout Private Routes start Here */

subwork_Router.use('/create/subworkout', Valid_User);
subwork_Router.use('/approve/subworkout', Valid_User);
// subwork_Router.use('/single/subworkout/', Valid_User);

/* subworkout Private Routes End Here */


/* subworkout Public Routes start Here */

subwork_Router.post('/create/subworkout/:id', SubWorkCreate);
subwork_Router.get('/single/subworkout/:id', Single_SubWorkout);
subwork_Router.post('/approve/subworkout/:id', SubWorkout_Approve);

/* subworkout Public Routes End Here */

module.exports = subwork_Router;