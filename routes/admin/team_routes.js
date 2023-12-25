const express = require('express');
const Router = express;
const { Valid_User } = require('../../middleware/auth_middleware');
const { Create_Team, Fetch_Single_Team, Find_Team, Remove_Team, Update_Team,
    Fetch_Team, Update_Member_Profile } = require('../../controllers/admin/team_controller');

const team_Router = Router()

/* Team Private Routes start Here */

team_Router.use('/create/team', Valid_User);
team_Router.use('/update/team/:id', Valid_User);
team_Router.use('/fetch/team', Valid_User);
team_Router.use('/remove/team/:id', Valid_User);
team_Router.use('/update/team/profile/:id', Valid_User);
team_Router.use('/single/team/:id', Valid_User);

/* Team Private Routes End Here */


/* Team Public Routes start Here */

team_Router.post('/create/team', Create_Team);
team_Router.post('/update/team/:id', Update_Team);
team_Router.get('/fetch/team', Fetch_Team);
team_Router.post('/find/team/:key', Find_Team);
team_Router.post('/remove/team/:id', Remove_Team);
team_Router.get('/single/team/:id', Fetch_Single_Team);
team_Router.post('/update/team/profile/:id', Update_Member_Profile);

/* Team Public Routes End Here */


module.exports = team_Router;