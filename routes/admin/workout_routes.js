const express = require('express');
const Router = express;
const { Valid_User } = require('../../middleware/auth_middleware');
const { Create_workout, Update_Workout_Profile, Update_Workout,
    Get_Workout, Single_Workout, Remove_Workout,
} = require('../../controllers/admin/workout_controller');

const work_Router = Router()

/* workout Private Routes start Here */

work_Router.use('/create/workout', Valid_User);
work_Router.use('/fetch/workout', Valid_User);
work_Router.use('/update/workout/:id', Valid_User);
work_Router.use('/update/workout/Image/:id', Valid_User);
work_Router.use('/single/workout/:id', Valid_User);

/* workout Private Routes End Here */


/* workout Public Routes start Here */

work_Router.post('/create/workout', Create_workout);
work_Router.get('/fetch/workout', Get_Workout);
work_Router.get('/single/workout/:id', Single_Workout);
work_Router.post('/remove/workout/:id', Remove_Workout);
work_Router.post('/update/workout/:id', Update_Workout);
work_Router.post('/update/workout/Image/:id', Update_Workout_Profile);

/* workout Public Routes End Here */


module.exports = work_Router;